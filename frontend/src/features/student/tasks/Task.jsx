import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import useAuth from "../../../shared/hooks/useAuth";

import TaskHeader from "./components/TaskHeader";
import TaskModuleSidebar from "./components/TaskModuleSidebar";
import TaskDetailView from "./components/TaskDetailView";
import CodeSubmission from "./components/CodeSubmission";
import TaskStatusNotice from "./components/TaskStatusNotice";
import CertificateBanner from "./components/CertificateBanner";
import TaskDeadlineCard from "./components/TaskDeadlineCard";
import Spinner from '../../dashboard/common/LoaderPage/Spinner';

import useTaskData from "./hooks/useTaskData";
import useTaskRealtime from "./hooks/useTaskRealtime";
import useTaskSubmission from "./hooks/useTaskSubmission";

import {
    saveTaskState,
} from "../../../utils/taskStorage";
import {
    getTaskExpiresAt,
} from "./utils/taskUtils";

import "./Task.css";

const Task = () => {
    const {
        type: routeType,
        slug,
        courseSlug: routeCourseSlug,
    } = useParams();
    const location = useLocation();
    const contentType = routeType === "internship" ? "internship" : "course";
    const taskScope = location.state || {};

    const { user } = useAuth();

    const [activeTaskId, setActiveTaskId] = useState(null);

    const [now, setNow] = useState(() => Date.now());

    // -----------------------------------------
    // TASK DATA
    // -----------------------------------------
    const {
        courseSlug,
        courseTitle,
        studentName,
        modules,
        initialTaskId,

        loading,
        error,

        taskStatusMap,
        setTaskStatusMap,

        deadlineMap,
        setDeadlineMap,

        submittedAtMap,
        setSubmittedAtMap,

        applySubmissionState,
    } = useTaskData({
        contentType,
        routeCourseSlug,
        slug,
    });

    // -----------------------------------------
    // CLOCK
    // -----------------------------------------

    useEffect(() => {
        const timer =
            window.setInterval(() => {
                setNow(Date.now());
            }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    // -----------------------------------------
    // REALTIME SOCKET
    // -----------------------------------------

    useTaskRealtime({
        user,
        courseSlug,
        applySubmissionState,
        setActiveTaskId,
    });

    // -----------------------------------------
    // ALL TASKS
    // -----------------------------------------

    const allTasks = useMemo(() => {
        return modules.flatMap(
            (module) => module.tasks
        );
    }, [modules]);

    const scopedModules = useMemo(() => {
        const scopeModuleId = String(taskScope.moduleId || "");
        const scopeLessonId = String(taskScope.lessonId || "");

        if (!scopeModuleId && !scopeLessonId) {
            return modules;
        }

        return modules
            .filter((module) => (
                !scopeModuleId ||
                String(module.id) === scopeModuleId ||
                (module.tasks || []).some(
                    (task) => task.id === activeTaskId
                )
            ))
            .map((module) => {
                if (!scopeLessonId) {
                    return module;
                }

                const hasActiveTask = (module.tasks || []).some(
                    (task) => task.id === activeTaskId
                );

                const lessons = (module.lessons || []).filter(
                    (lesson) => {
                        const isScopedLesson =
                            String(lesson.lessonId) === scopeLessonId;

                        const isActiveLesson =
                            hasActiveTask &&
                            (lesson.tasks || []).some(
                                (task) => task.id === activeTaskId
                            );

                        return isScopedLesson || isActiveLesson;
                    }
                );

                return {
                    ...module,
                    lessons,
                    tasks: lessons.flatMap(
                        (lesson) => lesson.tasks || []
                    ),
                };
            })
            .filter((module) => module.tasks.length);
    }, [
        modules,
        activeTaskId,
        taskScope.moduleId,
        taskScope.lessonId,
    ]);

    const visibleTasks = useMemo(() => {
        return scopedModules.flatMap(
            (module) => module.tasks
        );
    }, [scopedModules]);

    const selectedTaskId = useMemo(() => {
        if (!visibleTasks.length) {
            return null;
        }

        const activeIsVisible = visibleTasks.some(
            (task) => task.id === activeTaskId
        );

        if (activeIsVisible) {
            return activeTaskId;
        }

        const requestedTaskId = String(taskScope.taskId || "");

        return (
            visibleTasks.find(
                (task) =>
                    requestedTaskId &&
                    (
                        task.id === requestedTaskId ||
                        task.taskId === requestedTaskId
                    )
            ) ||
            visibleTasks.find(
                (task) => task.id === initialTaskId
            ) ||
            visibleTasks.find((task) => {
                const status = taskStatusMap[task.id];

                return (
                    status !== "approved" &&
                    status !== "expired"
                );
            }) ||
            visibleTasks[0]
        )?.id;
    }, [
        activeTaskId,
        initialTaskId,
        taskScope.taskId,
        taskStatusMap,
        visibleTasks,
    ]);

    // -----------------------------------------
    // LOCKED TASKS
    // -----------------------------------------

    const lockedIds = useMemo(() => {
        const locked = new Set();

        for (
            let index = 1;
            index < allTasks.length;
            index++
        ) {
            const previousTask =
                allTasks[index - 1];

            if (
                taskStatusMap[
                previousTask.id
                ] !== "approved"
            ) {
                locked.add(
                    allTasks[index].id
                );
            }
        }

        return locked;
    }, [
        allTasks,
        taskStatusMap,
    ]);

    useEffect(() => {
        if (!visibleTasks.length) {
            return;
        }

        queueMicrotask(() => {
            setDeadlineMap((prev) => {
                let changed = false;
                const next = {
                    ...prev,
                };

                visibleTasks.forEach((task) => {
                    const status =
                        taskStatusMap[task.id];

                    const shouldHaveTimer =
                        !lockedIds.has(task.id) &&
                        status !== "approved" &&
                        status !== "expired";

                    const hasTimer =
                        getTaskExpiresAt(next[task.id]);

                    if (
                        shouldHaveTimer &&
                        !hasTimer
                    ) {
                        const startedAt =
                            Date.now();

                        const unlockedAt =
                            new Date(startedAt).toISOString();

                        next[task.id] = {
                            unlockedAt,
                            expiresAt:
                                new Date(
                                    startedAt +
                                    48 * 60 * 60 * 1000
                                ).toISOString(),
                            expiredAt: null,
                        };

                        changed = true;
                    }
                });

                return changed
                    ? next
                    : prev;
            });
        });
    }, [
        lockedIds,
        setDeadlineMap,
        taskStatusMap,
        visibleTasks,
    ]);

    // -----------------------------------------
    // CURRENT TASK
    // -----------------------------------------

    const currentTask = useMemo(() => {
        return (
            allTasks.find(
                (task) =>
                    task.id ===
                    selectedTaskId
            ) || null
        );
    }, [
        allTasks,
        selectedTaskId,
    ]);

    // -----------------------------------------
    // CURRENT MODULE
    // -----------------------------------------

    const currentModule = useMemo(() => {
        if (!currentTask) {
            return null;
        }

        return (
            modules.find(
                (module) =>
                    module.id ===
                    currentTask.moduleId
            ) || null
        );
    }, [
        modules,
        currentTask,
    ]);

    // -----------------------------------------
    // CURRENT TASK STATE
    // -----------------------------------------
    const currentDeadline =
        currentTask
            ? deadlineMap[
            currentTask.id
            ]
            : null;

    const currentStatus =
        currentTask
            ? taskStatusMap[
            currentTask.id
            ]
            : null;

    const currentExpired =
        currentStatus === "expired" ||
        (
            getTaskExpiresAt(currentDeadline) &&
            currentStatus !== "approved" &&
            new Date(
                getTaskExpiresAt(currentDeadline)
            ).getTime() <= now
        );

    // -----------------------------------------
    // AUTO EXPIRE
    // -----------------------------------------

    useEffect(() => {
        if (
            !currentTask ||
            !currentExpired ||
            currentStatus ===
            "expired"
        ) {
            return;
        }

        setTaskStatusMap((prev) => {
            const next = {
                ...prev,
                [currentTask.id]:
                    "expired",
            };

            saveTaskState(
                courseSlug,
                next
            );

            return next;
        });
    }, [
        courseSlug,
        currentExpired,
        currentStatus,
        currentTask,
        setTaskStatusMap,
    ]);

    // -----------------------------------------
    // COMPLETION
    // -----------------------------------------

    const approvedCount =
        useMemo(() => {
            return visibleTasks.filter(
                (task) =>
                    taskStatusMap[
                    task.id
                    ] === "approved"
            ).length;
        }, [
            visibleTasks,
            taskStatusMap,
        ]);

    const allCompleted =
        visibleTasks.length > 0 &&
        approvedCount ===
        visibleTasks.length;

    // -----------------------------------------
    // GLOBAL COMPLETION SIGNAL
    // -----------------------------------------

    useEffect(() => {
        try {
            localStorage.setItem(
                "all_tasks_completed",
                allCompleted
                    ? "true"
                    : "false"
            );
        } catch {
            // Ignore localStorage errors.
        }
    }, [allCompleted]);

    // -----------------------------------------
    // TASK SELECT
    // -----------------------------------------

    const handleSelectTask = (
        taskId
    ) => {
        if (
            lockedIds.has(taskId)
        ) {
            return;
        }

        setActiveTaskId(taskId);
    };

    // -----------------------------------------
    // SUBMISSION
    // -----------------------------------------

    const {
        submitting,
        handleSubmit,
    } = useTaskSubmission({
        courseSlug,
        allTasks,
        currentModule,
        taskStatusMap,
        setTaskStatusMap,
        setDeadlineMap,
        setSubmittedAtMap,
    });

    // -----------------------------------------
    // LOADING
    // -----------------------------------------

    if (loading) {
        return (
            <motion.div
                className="tasks-page task-page-loading"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
            >
                <Spinner message="Loading tasks..." size={60} />
            </motion.div>
        );
    }

    // -----------------------------------------
    // ERROR / EMPTY
    // -----------------------------------------

    if (
        error ||
        !modules.length ||
        !visibleTasks.length
    ) {
        return (
            <motion.div
                className="tasks-page task-page-loading"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
            >
                {error || "No tasks found for this internship."}
            </motion.div>
        );
    }

    // -----------------------------------------
    // UI
    // -----------------------------------------

    return (
        <motion.div
            className="tasks-page"
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 0.4,
            }}
        >
            <TaskHeader
                studentName={studentName}
                internshipTitle={courseTitle}
                moduleTitle={currentModule?.title || ""}
                completedCount={approvedCount}
                totalCount={visibleTasks.length}
            />

            <div className="tasks-layout">
                <TaskModuleSidebar
                    contentType={contentType}
                    modules={scopedModules}
                    activeTaskId={selectedTaskId}
                    taskStatusMap={taskStatusMap}
                    deadlineMap={deadlineMap}
                    now={now}
                    lockedIds={[
                        ...lockedIds,
                    ]}
                    onSelectTask={handleSelectTask}
                />

                <div className="tasks-main">
                    {currentTask ? (
                        <>
                            <TaskDetailView
                                task={
                                    currentTask
                                }
                            />

                            <TaskStatusNotice
                                submittedAt={
                                    submittedAtMap[
                                    currentTask.id
                                    ] || null
                                }
                                status={
                                    taskStatusMap[
                                    currentTask.id
                                    ]
                                }
                            />

                            <TaskDeadlineCard
                                deadline={
                                    currentDeadline
                                }
                                now={now}
                                expired={
                                    currentExpired
                                }
                                status={
                                    currentStatus
                                }
                            />

                            {taskStatusMap[
                                currentTask.id
                            ] !== "pending" &&
                                taskStatusMap[
                                currentTask.id
                                ] !==
                                "approved" && (
                                    <CodeSubmission
                                        task={
                                            currentTask
                                        }
                                        onSubmit={
                                            handleSubmit
                                        }
                                        submitting={
                                            submitting
                                        }
                                        disabled={
                                            lockedIds.has(
                                                currentTask.id
                                            ) ||
                                            currentExpired
                                        }
                                        expired={
                                            currentExpired
                                        }
                                    />
                                )}
                        </>
                    ) : (
                        <div className="tasks-main-empty">
                            Select a task to get
                            started.
                        </div>
                    )}
                </div>
            </div>

            <CertificateBanner
                completedCount={
                    approvedCount
                }
                totalCount={
                    visibleTasks.length
                }
                allCompleted={
                    allCompleted
                }
            />
        </motion.div>
    );
};

export default Task;
