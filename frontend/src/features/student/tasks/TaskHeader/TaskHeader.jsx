import { motion } from "framer-motion";
import { FiBookOpen, FiUser, FiLayers } from "react-icons/fi";

import "./TaskHeader.css";

export default function TaskHeader({
    studentName = "Student",
    internshipTitle = "Internship",
    moduleTitle = "",
    completedCount = 0,
    totalCount = 0,
}) {
    const percent =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <motion.header
            className="task-header"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="task-header-glow" />

            <div className="task-header-top">
                <div className="task-header-user">
                    <span className="task-header-icon"><FiUser /></span>
                    <div>
                        <small>Student</small>
                        <h2>{studentName}</h2>
                    </div>
                </div>

                <div className="task-header-internship">
                    <span className="task-header-icon"><FiBookOpen /></span>
                    <div>
                        <small>Enrolled Internship</small>
                        <h3>{internshipTitle}</h3>
                    </div>
                </div>
            </div>

            {moduleTitle && (
                <div className="task-header-module">
                    <span className="task-header-icon"><FiLayers /></span>
                    <div>
                        <small>Active Module</small>
                        <h4>{moduleTitle}</h4>
                    </div>
                </div>
            )}

            <div className="task-header-progress">
                <div className="task-header-progress-label">
                    <span>
                        {completedCount} / {totalCount} Tasks Completed
                    </span>
                    <span>{percent}%</span>
                </div>
                <div className="task-header-progress-track">
                    <motion.div
                        className="task-header-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>
        </motion.header>
    );
}
