import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    BookOpen,
} from "lucide-react";
import { FiLock, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";

import "./TaskModuleSidebar.css";

// Determine the visual status of a task item.
const getTaskStatus = (task, taskStatusMap) => {
    const status = taskStatusMap[task.id] || "pending";
    if (status === "approved") return "approved";
    if (status === "expired") return "expired";
    if (status === "pending") return "pending";
    if (status === "rejected") return "rejected";
    return "unlocked";
};

export default function TaskModuleSidebar({
    modules = [],
    activeTaskId,
    taskStatusMap = {},
    lockedIds = [],
    onSelectTask,
}) {
    const [openModules, setOpenModules] = useState(
        () => new Set(modules.length ? [modules[0].id] : [])
    );

    const toggleModule = (moduleId) => {
        setOpenModules((prev) => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    const handleTaskClick = (task) => {
        if (lockedIds.includes(task.id)) {
            toast.warning("Complete the current task first!");
            return;
        }
        onSelectTask(task.id);
    };

    return (
        <motion.aside
            className="task-module-sidebar"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
        >
            <div className="task-sidebar-header">
                <span className="task-sidebar-icon"><FiClock /></span>
                <div>
                    <h3>Internship Tasks</h3>
                    <p>Complete in order to unlock</p>
                </div>
            </div>

            <div className="task-sidebar-list">
{modules.length === 0 && (
                    <div className="task-sidebar-empty">No tasks yet.</div>
                )}

{modules.filter((m) => (m.tasks || []).length > 0).map((module) => {
                    const isOpen = openModules.has(module.id);
                    return (
                        <div
                            className="task-module"
                            key={module.id}
                        >
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className="task-module-header"
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="task-module-title">
                                    <BookOpen size={17} />
                                    <div>
                                                    <h4>{module.title}</h4>
                                        <span>{module.tasks?.length || 0} Tasks</span>
                                    </div>
                                </div>
                                {isOpen ? (
                                    <ChevronDown size={19} />
                                ) : (
                                    <ChevronRight size={19} />
                                )}
                            </motion.div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        className="task-module-items"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {module.tasks.map((task) => {
                                            const status = getTaskStatus(
                                                task,
                                                taskStatusMap
                                            );
                                            const locked =
                                                lockedIds.includes(task.id);
                                            const active =
                                                activeTaskId === task.id;
                                            return (
                                                <motion.div
                                                    key={task.id}
                                                    whileHover={{ x: 5 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`task-item ${
                                                        active ? "active" : ""
                                                    } ${locked ? "locked" : ""}`}
                                                    onClick={() =>
                                                        handleTaskClick(task)
                                                    }
                                                >
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
                                                        ) : (
                                                            <span className="task-pending-badge">
                                                                ?
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="task-item-text">
                                                        <h5>{task.title}</h5>
                                                        <small>{task.level || "Task"}</small>
                                                    </div>

                                                    {status === "unlocked" && !locked && (
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
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            <div className="task-sidebar-footer">
                <span><CheckCircle2 size={14} /> Approved</span>
                <span><FiClock size={14} /> Pending</span>
                <span><FiLock size={14} /> Locked</span>
            </div>
        </motion.aside>
    );
}
