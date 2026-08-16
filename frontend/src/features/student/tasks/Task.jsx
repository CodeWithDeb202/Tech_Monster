import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import api from "../../../services/api/axios";
import { getProfile } from "../../../services/api/profileService";
import { getMyCourseSubmissions } from "../../../services/api/submissionService";
import useAuth from "../../../shared/hooks/useAuth";
import { socket } from "../../../services/socket/socket";
import {
    loadTaskState,
    saveTaskState,
    clearTaskState,
} from "../../../utils/taskStorage";

// Task components
import TaskHeader from "./TaskHeader";
import TaskModuleSidebar from "./TaskModuleSidebar";
import TaskDetailView from "./TaskDetailView";
import CodeSubmission from "./CodeSubmission";
import TaskStatusNotice from "./TaskStatusNotice";
import CertificateBanner from "./CertificateBanner";

import "./Task.css";

const normalizeSlug = (slug) =>
    String(slug || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");

// =====================================================
// TESTING MODE
// =====================================================
const TESTING_RESET_ON_REFRESH = true;

const getTaskKey = (submission) => `${submission.moduleId}_${submission.taskId}`;

const formatCountdown = (expiresAt, now) => {
    if (!expiresAt) return "No deadline";

    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return "Expired";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// Build module/task structure from course data.
//
// Per the exact course JSON structure, each LESSON carries its OWN `tasks[]`
// identical across lessons (task-1, task-2, task-3 repeat in every lesson).
// To avoid showing duplicate tasks (e.g. 9 tasks instead of 3), we flatten
// every lesson's tasks but DEDUPLICATE by taskId within a module, so each
// module exposes exactly its unique task list (e.g. 3 tasks).
//
// Each task still records the lessonId it came from (used when POSTing a
// submission) and gets a module-scoped unique look-up id.
const buildModules = (courseData) => {
    if (!courseData?.modules) return [];

    return courseData.modules.map((module) => {
        const moduleId = module.moduleId || "";
        const lessons = module.lessons || [];

        // Flatten all lessons' tasks, then dedupe by taskId so an identical
        // task-1/task-2/task-3 in each lesson collapses to just 3 tasks.
        const deduped = [];
        const seen = new Set();

        lessons.forEach((lesson) => {
            const lessonId = lesson.lessonId || "";
            (lesson.tasks || []).forEach((task) => {
                const taskId = task.taskId || "task";
                if (seen.has(taskId)) return; // skip duplicate taskId
                seen.add(taskId);

                deduped.push({
                    // module-scoped unique id (moduleId + taskId)
                    id: `${moduleId}_${taskId}`,
                    moduleId,
                    lessonId, // first lesson that declared this task
                    taskId,
                    title: task.title || "Task",
                    level: task.level || "Task",
                    problemStatement: task.problemStatement || "",
                    hint: task.hint || "",
                    solutionCode: task.solutionCode || "",
                });
            });
        });

        return {
            id: moduleId || `module-${Date.now()}`,
            title: module.moduleTitle || "Module",
            tasks: deduped,
        };
    });
};

export default function Task() {
    const { slug, courseSlug: routeCourseSlug } = useParams();
    const { user } = useAuth();

    const [courseSlug, setCourseSlug] = useState(
        normalizeSlug(routeCourseSlug || slug || "")
    );

    const [courseTitle, setCourseTitle] = useState("Internship");
    const [studentName, setStudentName] = useState("Student");
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTaskId, setActiveTaskId] = useState(null);
    const [taskStatusMap, setTaskStatusMap] = useState({});
    const [deadlineMap, setDeadlineMap] = useState({});
    const [submissionIdMap, setSubmissionIdMap] = useState({});
    const [now, setNow] = useState(Date.now());
    // Tracks the real submission timestamp (if any) per task id, so the
    // "pending admin approval" notice can show an accurate delay indicator.
    const [submittedAtMap, setSubmittedAtMap] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    const applySubmissionState = (submission) => {
        if (!submission?.moduleId || !submission?.taskId) return;

        const key = getTaskKey(submission);

        setTaskStatusMap((prev) => {
            const next = { ...prev, [key]: submission.status };
            if (courseSlug) saveTaskState(courseSlug, next);
            return next;
        });

        if (submission.submittedAt) {
            setSubmittedAtMap((prev) => ({
                ...prev,
                [key]: submission.submittedAt,
            }));
        }

        setDeadlineMap((prev) => ({
            ...prev,
            [key]: {
                unlockedAt: submission.unlockedAt || null,
                expiresAt: submission.expiresAt || null,
                expiredAt: submission.expiredAt || null,
            },
        }));

        setSubmissionIdMap((prev) => ({
            ...prev,
            [key]: submission._id,
        }));
    };

    useEffect(() => {
        if (!user?._id && !user?.id) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join", String(user._id || user.id));

        const handleApproved = ({ submission, unlockedSubmission }) => {
            if (submission) {
                applySubmissionState(submission);
                toast.success(`Approved: ${submission.taskTitle || submission.taskId}`);
            }

            if (unlockedSubmission) {
                applySubmissionState(unlockedSubmission);
                toast.info(`Unlocked: ${unlockedSubmission.taskTitle || unlockedSubmission.taskId}`);
                setActiveTaskId((current) => current || getTaskKey(unlockedSubmission));
            }
        };

        const handleExtended = ({ submission }) => {
            if (!submission) return;
            applySubmissionState(submission);
            toast.success(`Deadline extended: ${submission.taskTitle || submission.taskId}`);
        };

        const handleExpired = ({ submission }) => {
            if (!submission) return;
            applySubmissionState(submission);
            toast.error(`Expired: ${submission.taskTitle || submission.taskId}`);
        };

        const handleUnlocked = ({ submission }) => {
            if (!submission) return;
            applySubmissionState(submission);
            toast.info(`Unlocked: ${submission.taskTitle || submission.taskId}`);
        };

        const handleRejected = ({ submission }) => {
            if (!submission) return;
            applySubmissionState(submission);
            toast.warning(`Needs correction: ${submission.taskTitle || submission.taskId}`);
        };

        socket.on("taskApproved", handleApproved);
        socket.on("taskDeadlineExtended", handleExtended);
        socket.on("taskExpired", handleExpired);
        socket.on("taskUnlocked", handleUnlocked);
        socket.on("taskRejected", handleRejected);

        return () => {
            socket.off("taskApproved", handleApproved);
            socket.off("taskDeadlineExtended", handleExtended);
            socket.off("taskExpired", handleExpired);
            socket.off("taskUnlocked", handleUnlocked);
            socket.off("taskRejected", handleRejected);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id, user?.id, courseSlug]);

    // Resolve a course slug when the URL does not provide one.
    const resolveCourseSlug = async () => {
        try {
            const myRes = await api.get("/internships/student/my");
            const myList = myRes?.data?.internships || [];
            const enrolledSlug =
                myList.find((item) => item.slug)?.slug ||
                myList[0]?.internship?.slug ||
                myList[0]?.slug;
            if (enrolledSlug) return normalizeSlug(enrolledSlug);
        } catch {
            // fall through
        }

        try {
            const allRes = await api.get("/internships");
            const allList = allRes?.data?.internships || [];
            const firstSlug =
                allList.find((item) => item.slug)?.slug || allList[0]?.slug || null;
            return firstSlug ? normalizeSlug(firstSlug) : null;
        } catch {
            return null;
        }
    };

    // Load student name + course data.
    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // Student name
                try {
                    const profileRes = await getProfile();
                    const p = profileRes?.data?.user || profileRes?.data || {};
                    const name =
                        [p.firstName, p.lastName].filter(Boolean).join(" ") ||
                        p.name ||
                        p.username ||
                        "Student";
                    if (mounted) setStudentName(name);
                } catch {
                    // non-fatal
                }

                let targetSlug = courseSlug;
                if (!targetSlug) {
                    targetSlug = await resolveCourseSlug();
                    if (mounted && targetSlug) setCourseSlug(targetSlug);
                }

                if (!targetSlug) {
                    if (mounted) {
                        setError("No internship found. Please enroll in a course first.");
                        setLoading(false);
                    }
                    return;
                }

                const response = await api.get(`/internships/slug/${targetSlug}`);
                const courseData =
                    response?.data?.internship || response?.data || null;

                if (!courseData) {
                    if (mounted) {
                        setError("Course content could not be loaded.");
                        setLoading(false);
                    }
                    return;
                }

                if (mounted) {
                    setCourseTitle(courseData.title || "Internship");
                    const built = buildModules(courseData);

                    // Load persisted task status from localStorage (fast cache).
                    // const stored = loadTaskState(targetSlug);
                    // setTaskStatusMap(stored);

                    // setModules(built);

                    setModules(built);

                    let stored = {};

                    if (TESTING_RESET_ON_REFRESH) {
                        // =================================================
                        // TESTING MODE
                        // Refresh pare previous task progress remove.
                        // =================================================
                        clearTaskState(targetSlug);
                        stored = {};
                    } else {
                        // =================================================
                        // PRODUCTION MODE
                        // Existing task progress restore.
                        // =================================================
                        stored = loadTaskState(targetSlug);
                    }

                    setTaskStatusMap(stored);

                    // Rehydrate authoritative status from the backend.
                    // try {
                    //     const subRes = await getMyCourseSubmissions(targetSlug);
                    //     const subs = subRes?.data?.submissions || [];
                    //     if (subs.length) {
                    //         const serverMap = {};
                    //         const timeMap = {};
                    //         const deadlineInfo = {};
                    //         const submissionIds = {};
                    //         subs.forEach((s) => {
                    //             // task.id is `${moduleId}_${taskId}` after dedup
                    //             const key = getTaskKey(s);
                    //             serverMap[key] = s.status;
                    //             if (s.submittedAt) timeMap[key] = s.submittedAt;
                    //             deadlineInfo[key] = {
                    //                 unlockedAt: s.unlockedAt || null,
                    //                 expiresAt: s.expiresAt || null,
                    //                 expiredAt: s.expiredAt || null,
                    //             };
                    //             submissionIds[key] = s._id;
                    //         });
                    //         // Merge: backend is authoritative, localStorage fills gaps.
                    //         const merged = { ...stored, ...serverMap };
                    //         setTaskStatusMap(merged);
                    //         setSubmittedAtMap(timeMap);
                    //         setDeadlineMap(deadlineInfo);
                    //         setSubmissionIdMap(submissionIds);
                    //         saveTaskState(targetSlug, merged);
                    //     }
                    // } catch {
                    //     // Keep localStorage cache on network/backend errors.
                    // }


                    // =====================================================
                    // BACKEND SUBMISSION REHYDRATION
                    // Production:
                    //   Backend status restore heba.
                    //
                    // Testing:
                    //   Refresh pare backend status restore karibani.
                    //   Eha dwara testing purpose re progress reset heba.
                    // =====================================================

                    if (!TESTING_RESET_ON_REFRESH) {
                        try {
                            const subRes = await getMyCourseSubmissions(targetSlug);
                            const subs = subRes?.data?.submissions || [];

                            if (subs.length) {
                                const serverMap = {};
                                const timeMap = {};
                                const deadlineInfo = {};
                                const submissionIds = {};

                                subs.forEach((s) => {
                                    const key = getTaskKey(s);

                                    serverMap[key] = s.status;

                                    if (s.submittedAt) {
                                        timeMap[key] = s.submittedAt;
                                    }

                                    deadlineInfo[key] = {
                                        unlockedAt: s.unlockedAt || null,
                                        expiresAt: s.expiresAt || null,
                                        expiredAt: s.expiredAt || null,
                                    };

                                    submissionIds[key] = s._id;
                                });

                                // Backend is authoritative in production.
                                const merged = {
                                    ...stored,
                                    ...serverMap,
                                };

                                setTaskStatusMap(merged);
                                setSubmittedAtMap(timeMap);
                                setDeadlineMap(deadlineInfo);
                                setSubmissionIdMap(submissionIds);

                                saveTaskState(targetSlug, merged);
                            }
                        } catch {
                            // Keep local state if backend request fails.
                        }
                    }

                    // Auto-select the first available (unlocked) task.
                    const flat = built.flatMap((m) => m.tasks);
                    // const latestMap = { ...stored };
                    // try {
                    //     const subRes = await getMyCourseSubmissions(targetSlug);
                    //     (subRes?.data?.submissions || []).forEach((s) => {
                    //         latestMap[getTaskKey(s)] = s.status;
                    //     });
                    // } catch {
                    //     // ignore
                    // }

                    const latestMap = { ...stored };

                    if (!TESTING_RESET_ON_REFRESH) {
                        try {
                            const subRes = await getMyCourseSubmissions(targetSlug);

                            (subRes?.data?.submissions || []).forEach((s) => {
                                latestMap[getTaskKey(s)] = s.status;
                            });
                        } catch {
                            // Ignore backend errors.
                        }
                    }
                    const firstAvailable =
                        flat.find((task) => {
                            const status = latestMap[task.id];
                            return status !== "approved" && status !== "expired";
                        }) ||
                        flat[0];
                    setActiveTaskId(firstAvailable?.id || null);
                }
            } catch {
                if (mounted) {
                    setError("Unable to load task data right now.");
                    setLoading(false);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseSlug]);

    // Flatten all tasks in sequential order for locking logic.
    const allTasks = useMemo(
        () => modules.flatMap((module) => module.tasks),
        [modules]
    );

    const flattenedTasks = useMemo(() => {
        return modules.flatMap((module) => module.tasks);
    }, [modules]);

    // Derive locked IDs: strict sequential — task N+1 locked until task N approved.
    const lockedIds = useMemo(() => {
        const locked = new Set();
        for (let i = 1; i < flattenedTasks.length; i++) {
            const prev = flattenedTasks[i - 1];
            if (taskStatusMap[prev.id] !== "approved") {
                locked.add(flattenedTasks[i].id);
            }
        }
        return locked;
    }, [flattenedTasks, taskStatusMap]);

    const currentTask = useMemo(
        () => flattenedTasks.find((task) => task.id === activeTaskId) || null,
        [flattenedTasks, activeTaskId]
    );

    const currentModule = useMemo(() => {
        if (!currentTask) return null;
        return modules.find((m) => m.id === currentTask.moduleId) || null;
    }, [modules, currentTask]);

    const currentDeadline = currentTask ? deadlineMap[currentTask.id] : null;
    const currentStatus = currentTask ? taskStatusMap[currentTask.id] : null;
    const currentExpired =
        currentStatus === "expired" ||
        (
            currentDeadline?.expiresAt &&
            !["pending", "approved"].includes(currentStatus) &&
            new Date(currentDeadline.expiresAt).getTime() <= now
        );

    useEffect(() => {
        if (!currentTask || !currentExpired || currentStatus === "expired") return;

        setTaskStatusMap((prev) => {
            const next = { ...prev, [currentTask.id]: "expired" };
            saveTaskState(courseSlug, next);
            return next;
        });
    }, [courseSlug, currentExpired, currentStatus, currentTask]);

    const approvedCount = useMemo(
        () => allTasks.filter((task) => taskStatusMap[task.id] === "approved").length,
        [allTasks, taskStatusMap]
    );

    const allCompleted =
        allTasks.length > 0 && approvedCount === allTasks.length;

    // Sync the global "all tasks completed" signal so the Sidebar can lock or
    // unlock the Certificate link across routes.
    useEffect(() => {
        try {
            localStorage.setItem("all_tasks_completed", allCompleted ? "true" : "false");
        } catch {
            // ignore write errors
        }
    }, [allCompleted]);

    const handleSelectTask = (taskId) => {
        if (lockedIds.has(taskId)) {
            toast.warning("Complete the current task first!");
            return;
        }
        setActiveTaskId(taskId);
    };

    const handleSubmit = async (taskId, code) => {
        if (!taskId || !code.trim()) return;
        if (taskStatusMap[taskId] === "expired") {
            toast.error("This task deadline has expired. Please contact support.");
            return;
        }

        setSubmitting(true);

        try {
            // Locate the task being submitted to forward module/lesson metadata.
            const task = allTasks.find((t) => t.id === taskId) || null;

            // POST /api/submissions — creates a DB submission for admin review.
            await api.post("/submissions", {
                courseSlug,
                moduleId: task?.moduleId || "",
                moduleTitle: currentModule?.title || "",
                lessonId: task?.lessonId || "",
                taskId: task?.taskId || taskId,
                taskTitle: task?.title || "",
                problemStatement: task?.problemStatement || "",
                code,
            });

            // Update local state + persist (fast cache).
            const nowIso = new Date().toISOString();
            setTaskStatusMap((prev) => {
                const next = { ...prev, [taskId]: "pending" };
                saveTaskState(courseSlug, next);
                return next;
            });
            setSubmittedAtMap((prev) => ({ ...prev, [taskId]: nowIso }));

            toast.success("Task submitted for approval!");
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to submit task. Please try again.";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <motion.div
                className="tasks-page task-page-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Loading tasks...
            </motion.div>
        );
    }

    if (error || !modules.length || !allTasks.length) {
        return (
            <motion.div
                className="tasks-page task-page-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {error || "No tasks found for this internship."}
            </motion.div>
        );
    }

    return (
        <motion.div
            className="tasks-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <TaskHeader
                studentName={studentName}
                internshipTitle={courseTitle}
                moduleTitle={currentModule?.title || ""}
                completedCount={approvedCount}
                totalCount={allTasks.length}
            />

            <div className="tasks-layout">
                <TaskModuleSidebar
                    modules={modules}
                    activeTaskId={activeTaskId}
                    taskStatusMap={taskStatusMap}
                    lockedIds={[...lockedIds]}
                    onSelectTask={handleSelectTask}
                />

                <div className="tasks-main">
                    {currentTask ? (
                        <>
                            <TaskDetailView task={currentTask} />

                            <TaskStatusNotice
                                submittedAt={
                                    submittedAtMap[currentTask.id] || null
                                }
                                status={taskStatusMap[currentTask.id]}
                            />

                            <div className={`task-deadline-card ${currentExpired ? "expired" : ""}`}>
                                <div>
                                    <span>Deadline</span>
                                    <strong>
                                        {formatCountdown(
                                            currentDeadline?.expiresAt,
                                            now
                                        )}
                                    </strong>
                                </div>
                                <p>
                                    {currentExpired
                                        ? "Submission is disabled. Contact support for an extension."
                                        : currentDeadline?.expiresAt
                                            ? "Submit within 48 hours of unlock."
                                            : "This task starts when it unlocks."}
                                </p>
                            </div>

                            {taskStatusMap[currentTask.id] !== "pending" &&
                                taskStatusMap[currentTask.id] !== "approved" && (
                                    <CodeSubmission
                                        task={currentTask}
                                        onSubmit={handleSubmit}
                                        submitting={submitting}
                                        disabled={
                                            lockedIds.has(currentTask.id) ||
                                            currentExpired
                                        }
                                        expired={currentExpired}
                                    />
                                )}
                        </>
                    ) : (
                        <div className="tasks-main-empty">
                            Select a task to get started.
                        </div>
                    )}
                </div>
            </div>

            <CertificateBanner
                completedCount={approvedCount}
                totalCount={allTasks.length}
                allCompleted={allCompleted}
            />
        </motion.div>
    );
}
