import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        internship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Internship",
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        // ==========================
        // STUDENT SUBMISSION
        // ==========================

        code: {

            type: String,

            default: ""

        },

        answer: {

            type: String,

            default: ""

        },

        githubLink: {

            type: String,

            default: ""

        },

        liveLink: {

            type: String,

            default: ""

        },

        submittedAt: {

            type: Date,

            default: null

        },

        // ==========================
        // ADMIN REVIEW
        // ==========================

        reviewStatus: {

            type: String,

            enum: [

                "Not Submitted",

                "Pending",

                "Approved",

                "Rejected"

            ],

            default: "Not Submitted"

        },

        reviewComment: {

            type: String,

            default: ""

        },

        reviewedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },

        reviewedAt: {

            type: Date,

            default: null

        },

        // ==========================
        // Student Progress
        // ==========================

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Submitted",
                "Approved",
                "Incorrect"
            ],
            default: "Pending"
        },

        // ==========================
        // Student Submission
        // ==========================

        code: {
            type: String,
            default: ""
        },

        answer: {
            type: String,
            default: ""
        },

        githubLink: {
            type: String,
            default: ""
        },

        liveLink: {
            type: String,
            default: ""
        },

        submittedAt: {
            type: Date
        },

        // ==========================
        // Admin Review
        // ==========================

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        reviewedAt: {
            type: Date
        },

        adminComment: {
            type: String,
            default: ""
        },

        emailFlags: {
            submittedEmailSent: {
                type: Boolean,
                default: false
            },
            approvedEmailSent: {
                type: Boolean,
                default: false
            }
        }

    },
    {
        timestamps: true
    }
);

export default mongoose.model("Task", taskSchema);
