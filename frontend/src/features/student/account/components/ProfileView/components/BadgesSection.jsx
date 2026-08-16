import { motion } from "framer-motion";

export default function BadgesSection() {

    return (
        <motion.div
            id="badges-profile-box"

            initial={{
                opacity: 0,
                y: 15
            }}

            animate={{
                opacity: 1,
                y: 0
            }}
        >

            <label>
                Badges
            </label>


            <div id="badges-row">

                <span className="profile-badge">
                    🔥 7 Days Streak
                </span>


                <span className="profile-badge">
                    🏆 Task Master
                </span>

            </div>

        </motion.div>
    );
}