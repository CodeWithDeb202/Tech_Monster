import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            default: ""
        },
        file: {
            type: String,
            default: ""
        },
        seen: {
            type: Boolean,
            default: false
        },
        delivered: {
            type: Boolean,
            default: false
        },
        deletedFor: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],

        isDeleted: {

            type: Boolean,

            default: false

        },
        replyTo: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Message",

            default: null

        },
    },
    {
        timestamps: true
    }
);

messageSchema.index({
    sender: 1,
    receiver: 1,
    createdAt: -1
});

export default mongoose.model("Message", messageSchema);