import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

import "./LessonSearch.css";

export default function LessonSearch({
    search,
    setSearch
}) {

    return (
        <motion.div
            id="lesson-search"
            initial={{
                opacity: 0,
                y: -15
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
        >
            <Search
                size={18}
                id="search-icon"
            />

            <input
                type="text"
                placeholder="Search lesson..."
                value={search}
                onChange={(e)=>
                    setSearch(e.target.value)
                }
            />
            {
                search && (
                    <button
                        onClick={()=>setSearch("")}
                    >
                        <X size={18}/>
                    </button>
                )
            }
        </motion.div>
    );

}