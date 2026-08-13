import { useState } from "react";

export default function useSkills(formData, setFormData) {
    const [skillInput, setSkillInput] = useState("");

    const addSkill = () => {
        const skill = skillInput.trim();

        if (
            !skill ||
            formData.skills.length >= 7 ||
            formData.skills.includes(skill)
        ) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, skill]
        }));

        setSkillInput("");
    };

    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    return {
        skillInput,
        setSkillInput,
        addSkill,
        removeSkill
    };
}