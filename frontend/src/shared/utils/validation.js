export const validateField = (name, value) => {
    const trimmed = value?.trim();

    const rules = {
        firstName: () => {
            if (!trimmed) return "First name is required";
            if (trimmed.length < 3)
                return "Name must be at least 3 characters";
        },

        lastName: () => {
            if (!trimmed) return "Lastname is required";
            if (trimmed.length < 2)
                return "Lastname must have 2 characters";
        },

        phone: () => {
            if (!trimmed) return "Mobile number is required";
            if (trimmed.length < 10)
                return "Mobile number must be 10 digits";
        },

        education: () => {
            if (!trimmed) return "Please enter your education";
        },

        college: () => {
            if (!trimmed) return "College name is required";
        },

        branch: () => {
            if (!trimmed) return "Branch name is required";
        },

        year: () => {
            if (!trimmed) return "Year is required";
        },

        semester: () => {
            if (!trimmed) return "Semester is required";
        },

        currentAddress: () => {
            if (!trimmed) return "Current address is required";
        },

        pincode: () => {
            if (!trimmed) return "Pincode is required";
        }
    };

    return rules[name]?.() || "";
};


export const validateForm = (formData) => {
    const fields = [
        "firstName",
        "lastName",
        "education",
        "college",
        "branch",
        "year",
        "semester",
        "currentAddress",
        "pincode"
    ];

    const errors = {};

    fields.forEach((field) => {
        errors[field] = validateField(field, formData[field]);
    });

    return {
        errors,
        isValid: Object.values(errors).every((error) => !error)
    };
};