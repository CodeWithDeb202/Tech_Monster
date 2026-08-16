import './LessonHeader.css';

import {motion} from 'framer-motion';
import LessonBookmark from "../Bookmark";
import {
    BookOpen,
} from "lucide-react";

export default function LessonHeader({
    lesson,
    toggleBookmark
}){
    return(
        <>
            <motion.div
                className="lesson-header glass-card"
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div id="badge_and_circularProgressbar">
                    <span id="lesson-badge">
                        <BookOpen size={18} />
                        Internship Lesson
                    </span>
                </div>
                <h1>{lesson.title}</h1>
                <p>
                    Read every topic carefully before moving to the next lesson.
                </p>
                <div id="lesson-actions">
                    <LessonBookmark
                        bookmarked={lesson.bookmarked}
                        onToggle={toggleBookmark}
                    />
                </div>
            </motion.div>
        </>
    )
}