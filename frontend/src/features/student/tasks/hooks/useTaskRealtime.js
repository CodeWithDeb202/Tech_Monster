import { useEffect } from "react";

import { toast } from "react-toastify";

import { socket } from "../../../../services/socket/socket";

import { getTaskKey } from "../utils/taskUtils";

const useTaskRealtime = ({
    user,
    courseSlug,
    applySubmissionState,
    setActiveTaskId,
}) => {
    useEffect(() => {
        if (!user?._id && !user?.id) {
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        const userId = String(
            user._id || user.id
        );

        socket.emit("join", userId);

        const handleApproved = ({
            submission,
            unlockedSubmission,
        }) => {
            if (submission) {
                applySubmissionState(submission);

                toast.success(
                    `Approved: ${
                        submission.taskTitle ||
                        submission.taskId
                    }`
                );
            }

            if (unlockedSubmission) {
                applySubmissionState(
                    unlockedSubmission
                );

                const unlockedTaskKey =
                    getTaskKey(unlockedSubmission);

                toast.info(
                    `Unlocked: ${
                        unlockedSubmission.taskTitle ||
                        unlockedSubmission.taskId
                    }`
                );

                if (unlockedTaskKey) {
                    setActiveTaskId(unlockedTaskKey);
                }
            }
        };

        const handleExtended = ({ submission }) => {
            if (!submission) return;

            applySubmissionState(submission);

            toast.success(
                `Deadline extended: ${
                    submission.taskTitle ||
                    submission.taskId
                }`
            );
        };

        const handleExpired = ({ submission }) => {
            if (!submission) return;

            applySubmissionState(submission);

            toast.error(
                `Expired: ${
                    submission.taskTitle ||
                    submission.taskId
                }`
            );
        };

        const handleUnlocked = ({ submission }) => {
            if (!submission) return;

            applySubmissionState(submission);

            const taskKey = getTaskKey(submission);

            toast.info(
                `Unlocked: ${
                    submission.taskTitle ||
                    submission.taskId
                }`
            );

            if (taskKey) {
                setActiveTaskId(taskKey);
            }
        };

        const handleRejected = ({ submission }) => {
            if (!submission) return;

            applySubmissionState(submission);

            toast.warning(
                `Needs correction: ${
                    submission.taskTitle ||
                    submission.taskId
                }`
            );
        };

        socket.on(
            "taskApproved",
            handleApproved
        );

        socket.on(
            "taskDeadlineExtended",
            handleExtended
        );

        socket.on(
            "taskExpired",
            handleExpired
        );

        socket.on(
            "taskUnlocked",
            handleUnlocked
        );

        socket.on(
            "taskRejected",
            handleRejected
        );

        return () => {
            socket.off(
                "taskApproved",
                handleApproved
            );

            socket.off(
                "taskDeadlineExtended",
                handleExtended
            );

            socket.off(
                "taskExpired",
                handleExpired
            );

            socket.off(
                "taskUnlocked",
                handleUnlocked
            );

            socket.off(
                "taskRejected",
                handleRejected
            );
        };
    }, [
        user?._id,
        user?.id,
        courseSlug,
        applySubmissionState,
        setActiveTaskId,
    ]);
};

export default useTaskRealtime;
