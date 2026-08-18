import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useParams } from "react-router-dom";

import { motion } from "framer-motion";

import useAuth from "../../../shared/hooks/useAuth";

import TaskHeader from "./components/TaskHeader";
import TaskModuleSidebar from "./components/TaskModuleSidebar";
import TaskDetailView from "./components/TaskDetailView";
import CodeSubmission from "./components/CodeSubmission";
import TaskStatusNotice from "./components/TaskStatusNotice";
import CertificateBanner from "./components/CertificateBanner";
import TaskDeadlineCard from "./components/TaskDeadlineCard";

import useTaskData from "./hooks/useTaskData";
import useTaskRealtime from "./hooks/useTaskRealtime";
import useTaskSubmission from "./hooks/useTaskSubmission";

import {
    saveTaskState,
} from "../../../utils/taskStorage";

import "./Task.css";

const Task = () => {
    const {
        slug,
        courseSlug: routeCourseSlug,
    } = useParams();

    const { user } = useAuth();

    const [activeTaskId, setActiveTaskId] =
        useState(null);

    const [now, setNow] =
        useState(Date.now());

    // -----------------------------------------
    // TASK DATA
    // -----------------------------------------

    const {
        courseSlug,
        courseTitle,
        studentName,

        modules,

        loading,
        error,

        taskStatusMap,
        setTaskStatusMap,

        deadlineMap,
        setDeadlineMap,

        submissionIdMap,
        setSubmissionIdMap,

        submittedAtMap,
        setSubmittedAtMap,

        applySubmissionState,
    } = useTaskData({
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

    // -----------------------------------------
    // CURRENT TASK
    // -----------------------------------------

    const currentTask = useMemo(() => {
        return (
            allTasks.find(
                (task) =>
                    task.id ===
                    activeTaskId
            ) || null
        );
    }, [
        allTasks,
        activeTaskId,
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
            currentDeadline?.expiresAt &&
            ![
                "pending",
                "approved",
            ].includes(currentStatus) &&
            new Date(
                currentDeadline.expiresAt
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
            return allTasks.filter(
                (task) =>
                    taskStatusMap[
                        task.id
                    ] === "approved"
            ).length;
        }, [
            allTasks,
            taskStatusMap,
        ]);

    const allCompleted =
        allTasks.length > 0 &&
        approvedCount ===
            allTasks.length;

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
                Loading tasks...
            </motion.div>
        );
    }

    // -----------------------------------------
    // ERROR / EMPTY
    // -----------------------------------------

    if (
        error ||
        !modules.length ||
        !allTasks.length
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
                {error ||
                    "No tasks found for this internship."}
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
                internshipTitle={
                    courseTitle
                }
                moduleTitle={
                    currentModule?.title ||
                    ""
                }
                completedCount={
                    approvedCount
                }
                totalCount={
                    allTasks.length
                }
            />

            <div className="tasks-layout">
                <TaskModuleSidebar
                    modules={modules}
                    activeTaskId={
                        activeTaskId
                    }
                    taskStatusMap={
                        taskStatusMap
                    }
                    lockedIds={[
                        ...lockedIds,
                    ]}
                    onSelectTask={
                        handleSelectTask
                    }
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
                    allTasks.length
                }
                allCompleted={
                    allCompleted
                }
            />
        </motion.div>
    );
};

export default Task;