import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "./Pagination.css";

export default function Pagination({
    current,
    total,
    onPrevious,
    onNext
}) {

    return (

        <motion.div
            id="lesson-pagination"
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
        >

            <button
                id="pagination-btn"
                disabled={current === 0}
                onClick={onPrevious}
            >

                <ChevronLeft size={18} />

                Previous

            </button>

            <div id="pagination-center">

                <span id="pagination-text">

                    Lesson

                    <strong>

                        {current + 1}

                    </strong>

                    of

                    <strong>

                        {total}

                    </strong>

                </span>

                <div id="pagination-dots">
                    {
                        [...Array(total)].map((_, index) => (
                            <motion.div
                                key={index}
                                className={`pagination-dot ${index === current ? "active" : ""}`}
                                whileHover={{
                                    scale: 1.25
                                }}
                            />
                        ))
                    }
                </div>

            </div>

            <button
                id="pagination-btn"
                disabled={current === total - 1}
                onClick={onNext}
            >

                Next

                <ChevronRight size={18} />

            </button>

        </motion.div>

    );

}