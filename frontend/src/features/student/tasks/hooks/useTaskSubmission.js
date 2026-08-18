import { useState } from "react";

import { toast } from "react-toastify";

import api from "../../../../services/api/axios";

import { saveTaskState } from "../../../../utils/taskStorage";

const useTaskSubmission = ({
    courseSlug,
    allTasks,
    currentModule,
    taskStatusMap,
    setTaskStatusMap,
    setSubmittedAtMap,
}) => {
    const [submitting, setSubmitting] =
        useState(false);

    const handleSubmit = async (
        taskId,
        code
    ) => {
        if (!taskId || !code.trim()) {
            return;
        }

        if (
            taskStatusMap[taskId] ===
            "expired"
        ) {
            toast.error(
                "This task deadline has expired. Please contact support."
            );

            return;
        }

        setSubmitting(true);

        try {
            const task =
                allTasks.find(
                    (item) =>
                        item.id === taskId
                ) || null;

            await api.post(
                "/submissions",
                {
                    courseSlug,

                    moduleId:
                        task?.moduleId || "",

                    moduleTitle:
                        currentModule?.title || "",

                    lessonId:
                        task?.lessonId || "",

                    taskId:
                        task?.taskId ||
                        taskId,

                    taskTitle:
                        task?.title || "",

                    problemStatement:
                        task?.problemStatement ||
                        "",

                    code,
                }
            );

            const nowIso =
                new Date().toISOString();

            setTaskStatusMap((prev) => {
                const next = {
                    ...prev,
                    [taskId]: "pending",
                };

                saveTaskState(
                    courseSlug,
                    next
                );

                return next;
            });

            setSubmittedAtMap(
                (prev) => ({
                    ...prev,
                    [taskId]: nowIso,
                })
            );

            toast.success(
                "Task submitted for approval!"
            );
        } catch (error) {
            const message =
                error?.response?.data
                    ?.message ||
                "Failed to submit task. Please try again.";

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        submitting,
        handleSubmit,
    };
};

export default useTaskSubmission;