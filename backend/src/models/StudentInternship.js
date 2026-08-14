import mongoose from "mongoose";

const studentInternshipSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship"
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    completedTasks: {
        type: Number,
        default: 0
    },

    completedNotes: {
        type: Number,
        default: 0
    },

    completedLessons: {
        type: [String],
        default: []
    },

    progress: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: [
            "Not Started",
            "In Progress",
            "Completed"
        ],
        default: "Not Started"
    },

    startedAt: {
        type: Date
    },

    completedAt: {
        type: Date
    },

    certificateIssued: {
        type: Boolean,
        default: false
    },

    emailFlags: {
        joinedEmailSent: {
            type: Boolean,
            default: false
        },
        allLessonsEmailSent: {
            type: Boolean,
            default: false
        },
        allTasksEmailSent: {
            type: Boolean,
            default: false
        },
        completionEmailSent: {
            type: Boolean,
            default: false
        },
        certificateEmailSent: {
            type: Boolean,
            default: false
        }
    }

}, {
    timestamps: true
});

studentInternshipSchema.pre("validate", function (next) {

    if (!this.internship && !this.course) {
        return next(
            new Error(
                "Either internship or course is required"
            )
        );
    }

    if (this.internship && this.course) {
        return next(
            new Error(
                "A record cannot have both internship and course"
            )
        );
    }

});

export default mongoose.model(
    "StudentInternship",
    studentInternshipSchema
);

