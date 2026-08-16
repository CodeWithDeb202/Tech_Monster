export function calculatePasswordStrength(password = "") {

    const rules = [

        {

            label: "At least 8 characters",

            valid: password.length >= 8

        },

        {

            label: "One uppercase letter",

            valid: /[A-Z]/.test(password)

        },

        {

            label: "One lowercase letter",

            valid: /[a-z]/.test(password)

        },

        {

            label: "One number",

            valid: /\d/.test(password)

        },

        {

            label: "One special character",

            valid: /[^A-Za-z0-9]/.test(password)

        }

    ];

    const score = rules.filter(rule => rule.valid).length;

    let strength = "Weak";

    if (score >= 3) {

        strength = "Medium";

    }

    if (score === 5) {

        strength = "Strong";

    }

    return {

        score,

        strength,

        rules

    };

}