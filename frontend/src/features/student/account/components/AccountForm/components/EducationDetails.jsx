import { motion } from "framer-motion";
import Input from "../../../../../../components/ui/Input";
import {SkillsInput} from "./index";

function EducationDetails({
    formData,
    errors,
    handleChange,
    skillInput,
    setSkillInput,
    addSkill,
    removeSkill
}) {
    return (
        <>
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                id="form-section-title"
            >
                2. Educational Information
            </motion.h3>

            <div id="form-grid">

                <Input
                    label="What are you studying?"
                    type="text"
                    placeholder="e.g. B.Tech / BCA"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    error={errors.education}
                    required
                />

                <Input
                    label="College Name"
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    error={errors.college}
                    required
                />

                <Input
                    label="Branch"
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    error={errors.branch}
                    required
                />

                <Input
                    label="Year"
                    type="text"
                    placeholder="e.g. 3rd Year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    error={errors.year}
                    required
                />

                <Input
                    label="Semester"
                    type="text"
                    placeholder="e.g. 5th Sem"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    error={errors.semester}
                    required
                />

                <SkillsInput
                    skills={formData.skills}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    id="form-group"
                >
                    <label>Github</label>

                    <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    id="form-group"
                >
                    <label>LinkedIn</label>

                    <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                    />
                </motion.div>

            </div>
        </>
    );
}

export default EducationDetails;