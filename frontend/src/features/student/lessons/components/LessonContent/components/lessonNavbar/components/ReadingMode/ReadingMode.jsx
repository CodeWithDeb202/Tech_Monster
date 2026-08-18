import { motion } from "framer-motion";
import { BookOpen, BookOpenCheck } from "lucide-react";

import "./ReadingMode.css";

export default function ReadingMode({
    readingMode,
    setReadingMode,
    compact = false
}) {

    return (

        <motion.button
            className={`reading-mode-btn ${readingMode ? "active" : ""} ${compact ? "compact" : ""}`}
            whileHover={{
                scale: compact ? 1 : 1.05
            }}
            whileTap={{
                scale: .95
            }}
            onClick={() => setReadingMode(!readingMode)}
            title={readingMode ? "Exit Reading Mode" : "Reading Mode"}
        >

            {readingMode ? <BookOpenCheck size={20} /> : <BookOpen size={20} />}

            {!compact && (readingMode ? "Exit Reading Mode" : "Reading Mode")}

        </motion.button>

    );

}