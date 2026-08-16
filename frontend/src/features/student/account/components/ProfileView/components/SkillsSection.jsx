import { motion } from "framer-motion";

export default function SkillsSection({
    skills
}) {

    return (
        <motion.div
            id="skills-profile-box"

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
                Skills
            </label>


            <div id="skills-tags">

                {skills?.length > 0 ? (

                    skills.map(
                        (skill, index) => (

                            <span
                                className="skill-tag"
                                key={`${skill}-${index}`}
                            >
                                {skill}
                            </span>

                        )
                    )

                ) : (

                    <span className="empty-value">
                        No skills added
                    </span>

                )}

            </div>

        </motion.div>
    );
}