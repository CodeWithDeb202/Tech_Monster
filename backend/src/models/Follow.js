import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);


// Same user-ku multiple times follow karibaku prevent kariba
followSchema.index(
    {
        follower: 1,
        following: 1
    },
    {
        unique: true
    }
);


// User nijaku nijey follow kariparibani
followSchema.pre("save", function () {

    if (
        this.follower.toString() ===
        this.following.toString()
    ) {
        throw new Error(
            "You cannot follow yourself"
        );
    }

});


export default mongoose.model(
    "Follow",
    followSchema
);