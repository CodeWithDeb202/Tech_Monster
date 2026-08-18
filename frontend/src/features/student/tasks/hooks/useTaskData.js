import { useEffect, useState } from "react";

import api from "../../../../services/api/axios";
import { getProfile } from "../../../../services/api/profileService";
import { getMyCourseSubmissions } from "../../../../services/api/submissionService";

import {
    loadTaskState,
    saveTaskState,
    clearTaskState,
} from "../../../../utils/taskStorage";

import {
    normalizeSlug,
    buildModules,
    getTaskKey,
} from "../utils/taskUtils";

const TESTING_RESET_ON_REFRESH = true;

const useTaskData = ({
    routeCourseSlug,
    slug,
}) => {
    const [courseSlug, setCourseSlug] = useState(
        normalizeSlug(routeCourseSlug || slug || "")
    );

    const [courseTitle, setCourseTitle] = useState("Internship");
    const [studentName, setStudentName] = useState("Student");

    const [modules, setModules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [taskStatusMap, setTaskStatusMap] = useState({});
    const [deadlineMap, setDeadlineMap] = useState({});
    const [submissionIdMap, setSubmissionIdMap] = useState({});
    const [submittedAtMap, setSubmittedAtMap] = useState({});

    const applySubmissionState = (submission) => {
        if (!submission?.moduleId || !submission?.taskId) {
            return;
        }

        const key = getTaskKey(submission);

        setTaskStatusMap((prev) => {
            const next = {
                ...prev,
                [key]: submission.status,
            };

            if (courseSlug) {
                saveTaskState(courseSlug, next);
            }

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

    const resolveCourseSlug = async () => {
        try {
            const myRes = await api.get("/internships/student/my");

            const myList = myRes?.data?.internships || [];

            const enrolledSlug =
                myList.find((item) => item.slug)?.slug ||
                myList[0]?.internship?.slug ||
                myList[0]?.slug;

            if (enrolledSlug) {
                return normalizeSlug(enrolledSlug);
            }
        } catch {
            // Continue with all internships.
        }

        try {
            const allRes = await api.get("/internships");

            const allList = allRes?.data?.internships || [];

            const firstSlug =
                allList.find((item) => item.slug)?.slug ||
                allList[0]?.slug ||
                null;

            return firstSlug
                ? normalizeSlug(firstSlug)
                : null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // -----------------------------------------
                // STUDENT PROFILE
                // -----------------------------------------

                try {
                    const profileRes = await getProfile();

                    const profile =
                        profileRes?.data?.user ||
                        profileRes?.data ||
                        {};

                    const name =
                        [
                            profile.firstName,
                            profile.lastName,
                        ]
                            .filter(Boolean)
                            .join(" ") ||
                        profile.name ||
                        profile.username ||
                        "Student";

                    if (mounted) {
                        setStudentName(name);
                    }
                } catch {
                    // Profile failure is non-fatal.
                }

                // -----------------------------------------
                // COURSE SLUG
                // -----------------------------------------

                let targetSlug = courseSlug;

                if (!targetSlug) {
                    targetSlug = await resolveCourseSlug();

                    if (mounted && targetSlug) {
                        setCourseSlug(targetSlug);
                    }
                }

                if (!targetSlug) {
                    if (mounted) {
                        setError(
                            "No internship found. Please enroll in a course first."
                        );

                        setLoading(false);
                    }

                    return;
                }

                // -----------------------------------------
                // COURSE DATA
                // -----------------------------------------

                const response = await api.get(
                    `/internships/slug/${targetSlug}`
                );

                const courseData =
                    response?.data?.internship ||
                    response?.data ||
                    null;

                if (!courseData) {
                    if (mounted) {
                        setError(
                            "Course content could not be loaded."
                        );

                        setLoading(false);
                    }

                    return;
                }

                if (!mounted) return;

                setCourseTitle(
                    courseData.title || "Internship"
                );

                const builtModules =
                    buildModules(courseData);

                setModules(builtModules);

                // -----------------------------------------
                // LOCAL TASK STATE
                // -----------------------------------------

                let stored = {};

                if (TESTING_RESET_ON_REFRESH) {
                    clearTaskState(targetSlug);
                    stored = {};
                } else {
                    stored = loadTaskState(targetSlug);
                }

                setTaskStatusMap(stored);

                // -----------------------------------------
                // BACKEND SUBMISSIONS
                // -----------------------------------------

                if (!TESTING_RESET_ON_REFRESH) {
                    try {
                        const subRes =
                            await getMyCourseSubmissions(
                                targetSlug
                            );

                        const submissions =
                            subRes?.data?.submissions || [];

                        if (submissions.length) {
                            const serverMap = {};
                            const timeMap = {};
                            const deadlineInfo = {};
                            const submissionIds = {};

                            submissions.forEach((submission) => {
                                const key =
                                    getTaskKey(submission);

                                serverMap[key] =
                                    submission.status;

                                if (submission.submittedAt) {
                                    timeMap[key] =
                                        submission.submittedAt;
                                }

                                deadlineInfo[key] = {
                                    unlockedAt:
                                        submission.unlockedAt ||
                                        null,

                                    expiresAt:
                                        submission.expiresAt ||
                                        null,

                                    expiredAt:
                                        submission.expiredAt ||
                                        null,
                                };

                                submissionIds[key] =
                                    submission._id;
                            });

                            const merged = {
                                ...stored,
                                ...serverMap,
                            };

                            setTaskStatusMap(merged);
                            setSubmittedAtMap(timeMap);
                            setDeadlineMap(deadlineInfo);
                            setSubmissionIdMap(
                                submissionIds
                            );

                            saveTaskState(
                                targetSlug,
                                merged
                            );
                        }
                    } catch {
                        // Keep local state if backend fails.
                    }
                }

                // -----------------------------------------
                // SELECT FIRST AVAILABLE TASK
                // -----------------------------------------

                const flatTasks =
                    builtModules.flatMap(
                        (module) => module.tasks
                    );

                const latestMap = {
                    ...stored,
                };

                if (!TESTING_RESET_ON_REFRESH) {
                    try {
                        const subRes =
                            await getMyCourseSubmissions(
                                targetSlug
                            );

                        (
                            subRes?.data?.submissions || []
                        ).forEach((submission) => {
                            latestMap[
                                getTaskKey(submission)
                            ] = submission.status;
                        });
                    } catch {
                        // Ignore backend errors.
                    }
                }

                const firstAvailable =
                    flatTasks.find((task) => {
                        const status =
                            latestMap[task.id];

                        return (
                            status !== "approved" &&
                            status !== "expired"
                        );
                    }) || flatTasks[0];

                return firstAvailable?.id || null;
            } catch {
                if (mounted) {
                    setError(
                        "Unable to load task data right now."
                    );
                }

                return null;
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load().then((firstTaskId) => {
            if (mounted && firstTaskId) {
                // Exposed through return value.
            }
        });

        return () => {
            mounted = false;
        };

        // courseSlug intentionally controls reload.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseSlug]);

    return {
        courseSlug,
        setCourseSlug,

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
    };
};

export default useTaskData;