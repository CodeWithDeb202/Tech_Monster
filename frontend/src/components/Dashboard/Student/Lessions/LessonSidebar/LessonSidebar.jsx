import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import "./LessonSidebar.css";
import LessonAccordion from "./LessonAccordion";
import LessonSearch from "./LessonSearch";

export default function LessonSidebar({
    lessons,
    activeLesson,
    setActiveLesson,
    search,
    setSearch,
    filteredLessons,
    progress,
    completedLessons,
    courseSlug,
    approvedModuleIds = new Set()
}) {

    console.log("FilterModule", filteredLessons)
    return (
        <motion.aside
            id="lesson-sidebar"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                duration: 0.5,
            }}
        >
            {/* Header */}

            <div id="lesson-sidebar-header">
                <LessonSearch
                    search={search}
                    setSearch={setSearch}
                />

                <div id="lesson_sidebar_heading_content">
                    <BookOpen size={22} />
                    <h2>Course Lessons</h2>
                    <p>{lessons.length} Lessons</p>
                </div>
            </div>

            {/* Lesson List */}

            <div id="lesson-list">

                {

                    filteredLessons.map((lesson, moduleIndex) => (
                        console.log("lesson: sidebar", lesson),

<LessonAccordion
                            lesson={lesson}
                            key={lesson.id}
                            module={lesson.sections}
                            activeLesson={activeLesson}
                            setActiveLesson={setActiveLesson}
                            courseSlug={courseSlug}
                            approvedModuleIds={approvedModuleIds}
                            moduleNumber={moduleIndex + 1}
                        />

                    ))

                }

            </div>

            {/* Footer */}

            <div id="lesson-sidebar-footer">
                <h4>Course Progress</h4>
                <div id="sidebar-progress">
                    <div
                        id="sidebar-progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
                <span>
                    {completedLessons} / {lessons.length} Lessons Completed
                </span>
                <small>
                    {progress}% Completed
                </small>
            </div>
        </motion.aside>
    );
}
