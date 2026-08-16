import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

import LessonNavbar from './Components/lessonNavbar';

import "./LessonContent.css";
import LessonHeader from "./Components/LessonHeader";
import LessonPage from "./Components/LessonPage";

export default function LessonContent({
    lesson,
    toggleBookmark,
    handleComplete,
    readingMode,
    setReadingMode,
    onScrollProgress,
    readPercent = 0,
    completed = false,
    contentRef
}) {
     const innerRef = useRef(null);

     // Use the forwarded ref from the parent when provided, otherwise fall back
     // to the internal one.
     const contentRefFinal = contentRef || innerRef;

    // Attach a native scroll listener for precise scroll-percent tracking.
    useEffect(() => {
        const el = contentRefFinal.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollable =
                el.scrollHeight - el.clientHeight;

            const percent = scrollable <= 0
                ? 100
                : Math.min(100, Math.max(0, Math.round((el.scrollTop / scrollable) * 100)));

            if (typeof onScrollProgress === "function") {
                onScrollProgress(percent);
            }

            // Auto-complete only when the user has actually read the full lesson.
            // (The success toast is handled inside handleComplete in the parent.)
            if (percent >= 98 && !completed) {
                handleComplete();
            }
        };

        el.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, [contentRefFinal, onScrollProgress, handleComplete, completed]);

    // Show 100% for already-completed lessons, otherwise the live read percent.
    const displayPercent = completed ? 100 : readPercent;

    return (
        <motion.div
            id="lesson-content-wrapper"
            ref={contentRefFinal}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.45,
            }}
        >

            {/* Navbar */}
            <LessonNavbar 
                readingMode={readingMode}
                setReadingMode={setReadingMode}
                readPercent={displayPercent}
            />

            {/* Lesson Header */}

            <LessonHeader 
                toggleBookmark={toggleBookmark} 
                lesson={lesson} 
            />


            {/* Lesson page */}

            <LessonPage 
                lesson={lesson} 
            />


        </motion.div>
    );
}
