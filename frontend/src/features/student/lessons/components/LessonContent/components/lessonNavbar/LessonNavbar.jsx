import './LessonNavbar.css'

import {motion} from 'framer-motion';

import ReadingMode from "./components/ReadingMode";
import CircularProgressBar from "./components/CircularProgress";

export default function LessonNavbar({
    readingMode,
    setReadingMode,
    readPercent
}){
    return(
        <>
            <motion.div
                id="lesson-fixed-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <ReadingMode
                    readingMode={readingMode}
                    setReadingMode={setReadingMode}
                    compact
                />

                <CircularProgressBar value={readPercent} />
            </motion.div>
        </>
    )
}
