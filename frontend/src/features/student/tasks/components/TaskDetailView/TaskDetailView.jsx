import { motion } from "framer-motion";
import {
    FiList,
    FiTarget,
    FiHelpCircle,
    FiCode,
    FiAward,
} from "react-icons/fi";

import "./TaskDetailView.css";

export default function TaskDetailView({ task }) {
    if (!task) {
        return (
            <div className="task-detail-empty">
                Select a task from the sidebar to view its details.
            </div>
        );
    }

const objectives = task.objectives || [];
    const steps = task.steps || [];
    // The JSON tasks carry a singular `hint` string (not a `hints` array).
    // Normalize it so both shapes render correctly.
    const hints = Array.isArray(task.hints)
        ? task.hints
        : task.hint
            ? [task.hint]
            : [];

    return (
        <motion.div
            className="task-detail-view"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="task-detail-head">
                <div className="task-detail-badge">
                    <FiCode />
                </div>
                <div>
                    <span className="task-detail-level">
                        {task.level || "Task"}
                    </span>
                    <h2>{task.title}</h2>
                </div>
            </div>

            <div className="task-detail-section">
                <div className="task-detail-section-title">
                    <FiTarget />
                    <h3>Problem Statement</h3>
                </div>
                <p className="task-detail-problem">{task.problemStatement}</p>
            </div>

            {objectives.length > 0 && (
                <div className="task-detail-section">
                    <div className="task-detail-section-title">
                        <FiAward />
                        <h3>Objectives</h3>
                    </div>
                    <ul className="task-detail-list">
                        {objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                        ))}
                    </ul>
                </div>
            )}

            {steps.length > 0 && (
                <div className="task-detail-section">
                    <div className="task-detail-section-title">
                        <FiList />
                        <h3>Step-by-Step Instructions</h3>
                    </div>
                    <ol className="task-detail-steps">
                        {steps.map((step, i) => (
                            <li key={i}>
                                <span className="task-step-num">{i + 1}</span>
                                <p>{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {hints.length > 0 && (
                <div className="task-detail-section task-detail-hints">
                    <div className="task-detail-section-title">
                        <FiHelpCircle />
                        <h3>Hints & Starter Resources</h3>
                    </div>
                    <ul className="task-detail-list">
                        {hints.map((hint, i) => (
                            <li key={i}>{hint}</li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
}
