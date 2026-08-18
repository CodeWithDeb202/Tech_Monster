import { motion } from "framer-motion";

import {
    CheckCircle2,
} from "lucide-react";

import {
    FiClock,
    FiLock,
    FiUnlock,
    FiAlertCircle,
} from "react-icons/fi";

import { toast } from "react-toastify";

import {
    formatCountdown,
    getTaskExpiresAt,
} from "../../../../utils/taskUtils";

import "./TaskItem.css";


// =========================================
// TASK STATUS
// =========================================

const getTaskStatus = (
    task,
    taskStatusMap,
    lockedIds
) => {

    if (lockedIds.includes(task.id)) {
        return "locked";
    }

    const status =
        taskStatusMap?.[task.id];


    if (status === "approved") {
        return "approved";
    }

    if (status === "expired") {
        return "expired";
    }

    if (status === "rejected") {
        return "rejected";
    }

    if (
        status === "unlocked" ||
        status === "in_progress"
    ) {
        return "unlocked";
    }

    if (status === "pending") {
        return "pending";
    }

    return "unlocked";
};


export default function TaskItem({
    task,
    active,
    taskStatusMap = {},
    deadlineMap = {},
    now = 0,
    lockedIds = [],
    onSelectTask,
}) {

    const locked = lockedIds.includes(task.id);

    const status = getTaskStatus(
        task,
        taskStatusMap,
        lockedIds
    );


    const deadline =
        deadlineMap?.[task.id] ||
        deadlineMap?.[
            [
                task.moduleId,
                task.lessonId || "",
                task.taskId,
            ].join("_")
        ] ||
        deadlineMap?.[
            [
                task.moduleId,
                task.taskId,
            ].join("_")
        ] ||
        null;


    const expiresAt = getTaskExpiresAt(deadline);


    const canShowTimer =
        !locked &&
        status !== "approved" &&
        status !== "expired";


    const countdown =
        canShowTimer &&
        expiresAt
            ? formatCountdown(
                expiresAt,
                now
            )
            : null;


    const timerText =
        countdown;


    // =========================================
    // CLICK
    // =========================================

    const handleClick = () => {

        if (locked) {

            toast.warning(
                "Complete the previous task first!"
            );

            return;
        }


        onSelectTask?.(task.id);
    };


    return (

        <motion.div
            className={`
                task-item
                ${active ? "active" : ""}
                ${locked ? "locked" : ""}
                ${status === "expired" ? "expired" : ""}
            `}

            whileHover={
                !locked
                    ? { x: 5 }
                    : undefined
            }

            whileTap={{
                scale: 0.98,
            }}

            onClick={handleClick}
        >

            {/* ================================= */}
            {/* ICON */}
            {/* ================================= */}

            <div className="task-item-icon">

                {status === "approved" ? (

                    <CheckCircle2
                        size={17}
                        className="task-approved"
                    />

                ) : locked ? (

                    <FiLock
                        size={17}
                        className="task-locked"
                    />

                ) : status === "pending" ? (

                    <FiClock
                        size={17}
                        className="task-pending"
                    />

                ) : status === "expired" ? (

                    <FiClock
                        size={17}
                        className="task-expired"
                    />

                ) : status === "rejected" ? (

                    <FiAlertCircle
                        size={17}
                        className="task-rejected"
                    />

                ) : (

                    <FiUnlock
                        size={17}
                        className="task-unlocked"
                    />

                )}

            </div>


            {/* ================================= */}
            {/* TEXT */}
            {/* ================================= */}

            <div className="task-item-text">

                <h5>
                    {task.title}
                </h5>

                <small>
                    {task.level || "Task"}
                </small>


                {/* COUNTDOWN */}

                {timerText && (

                    <div
                        className={`
                            task-item-countdown
                            ${countdown === "00:00:00"
                                ? "danger"
                                : ""
                            }
                        `}
                    >

                        <FiClock size={12} />

                        <span>
                            Timer {timerText}
                        </span>

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* STATUS CHIP */}
            {/* ================================= */}

            {status === "locked" && (

                <span className="task-locked-chip">
                    Locked
                </span>

            )}


            {status === "unlocked" && (

                <span className="task-unlocked-chip">
                    Open
                </span>

            )}


            {status === "pending" && (

                <span className="task-pending-chip">
                    Pending
                </span>

            )}


            {status === "rejected" && (

                <span className="task-rejected-chip">
                    Fix
                </span>

            )}


            {status === "expired" && (

                <span className="task-expired-chip">
                    Expired
                </span>

            )}


            {status === "approved" && (

                <span className="task-approved-chip">
                    Done
                </span>

            )}

        </motion.div>
    );
}
