import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
        required: true
    },

    certificateNumber: {
        type: String,
        unique: true,
        required: true
    },

    issueDate: {
        type: Date,
        default: Date.now
    },

    pdfUrl: {
        type: String,
        default: ""
    },
    
    downloadCount: {

        type: Number,

        default: 0

    }

}, {
    timestamps: true
});


export default mongoose.model(
    "Certificate",
    certificateSchema
);