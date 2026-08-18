import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Circle,
    BookOpen,
} from "lucide-react";
import { FiLock, FiCheck, FiCheckSquare } from "react-icons/fi";
import { toast } from "react-toastify";

import "./LessonAccordion.css";

export default function LessonAccordion({
    lesson,
    module,
    activeLesson,
    setActiveLesson,
    courseSlug,
    contentType,
    approvedModuleIds = new Set(),
    moduleNumber = 1,
}) {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    // All lessons in this module must be completed before the task unlocks.
    const isModuleCompleted = (module || []).length > 0 &&
        (module || []).every((item) => item.completed);

    // Whether this module's task submission has been APPROVED by an admin.
    const isModuleTaskApproved = approvedModuleIds.has(lesson?.id);

    const handleLessonClick = (lessonItem) => {
        if (lessonItem.locked) {
            // Blocked because the PREVIOUS module's task is not yet approved.
            toast.warning(
                `Please submit and get Admin approval for Module ${moduleNumber - 1} Task before starting Module ${moduleNumber}!`
            );
            return;
        }

        setActiveLesson(lessonItem.id);
    };

    const handleTaskClick = () => {
        if (!isModuleCompleted) {
            toast.warning("Complete all lessons in this module before attempting the Task!");
            return;
        }

        navigate(
            `/student/tasks/${contentType}/${courseSlug}`,
            {
                state: {
                    courseSlug: courseSlug || null,
                    moduleId: lesson?.id || null,
                    lessonId: null,
                },
            }
        );
    };

    return (
        <div id="lesson-module">
            {/* Module Header */}

            <motion.div
                whileTap={{ scale: 0.98 }}
                id="module-header"
                onClick={() => setOpen(!open)}
            >
                <div id="module-title">
                    <BookOpen size={18} />

                    <div>
                        <h3>{lesson.title}</h3>

                        <span>
                            {lesson.length || 0} Lessons
                        </span>
                    </div>
                </div>

                {open ? (
                    <ChevronDown size={20} />
                ) : (
                    <ChevronRight size={20} />
                )}
            </motion.div>

            {/* Lessons */}

            <AnimatePresence>

                {open && (
                    <motion.div
                        id="module-lessons"
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.35,
                        }}
                    >
                        {(module || []).map((lessonItem) => (
                            <motion.div
                                key={lessonItem.id}
                                whileHover={{
                                    x: 6,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                className={`accordion-lesson ${activeLesson === lessonItem.id
                                    ? "active"
                                    : ""
                                    } ${lessonItem.locked ? "locked" : ""}`}
                                onClick={() =>
                                    handleLessonClick(lessonItem)
                                }
                            >
                                <div className="lesson-icon">
                                    {lessonItem.completed ? (
                                        <CheckCircle2
                                            size={18}
                                            className="completed"
                                        />
                                    ) : lessonItem.locked ? (
                                        <FiLock
                                            size={18}
                                            className="locked"
                                        />
                                    ) : (
                                        <Circle
                                            size={18}
                                            className="pending"
                                        />
                                    )}
                                </div>

                                <div id="lesson-text">
                                    <h4>{lessonItem.heading}</h4>
                                </div>
                            </motion.div>
                        ))}

                        {/* Module Task Bar (rendered after the last lesson) */}
                        <motion.div
                            whileHover={{ x: 6 }}
                            whileTap={{ scale: 0.98 }}
                            className={`accordion-task ${isModuleCompleted
                                ? "task-unlocked"
                                : "task-locked"}`}
                            onClick={handleTaskClick}
                        >
                            <div className="task-icon">
                                {isModuleTaskApproved ? (
                                    <FiCheck
                                        size={18}
                                        className="task-check"
                                    />
                                ) : isModuleCompleted ? (
                                    <FiCheckSquare
                                        size={18}
                                        className="task-ready"
                                    />
                                ) : (
                                    <FiLock
                                        size={18}
                                        className="task-lock"
                                    />
                                )}
                            </div>

                            <div id="task-text">
                                <h4>Module Task</h4>
                                <small>{lesson.title} assignment</small>
                            </div>

                            {isModuleTaskApproved ? (
                                <span className="task-badge badge-approved">Approved</span>
                            ) : isModuleCompleted ? (
                                <span className="task-badge">Ready</span>
                            ) : null}
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
