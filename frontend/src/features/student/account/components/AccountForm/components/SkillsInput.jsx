import { motion } from "framer-motion";

function SkillsInput({
    skills,
    skillInput,
    setSkillInput,
    addSkill,
    removeSkill
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            id="form-group"
        >
            <label>Add Skills (Maximum 7) *</label>

            <div id="skills-input-container">

                <input
                    type="text"
                    value={skillInput}
                    placeholder="Add skill & click add"
                    onChange={(e) =>
                        setSkillInput(e.target.value)
                    }
                />

                <button
                    type="button"
                    id="add-skill-btn"
                    onClick={addSkill}
                >
                    Add
                </button>

            </div>

            <div id="skills-tags">
                {skills.map((skill, index) => (
                    <span
                        key={`${skill}-${index}`}
                        id="skill-tag"
                    >
                        {skill}

                        <span
                            onClick={() => removeSkill(index)}
                            role="button"
                            tabIndex={0}
                        >
                            ×
                        </span>
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

export default SkillsInput;