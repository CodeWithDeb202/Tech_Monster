import mongoose from "mongoose";

const userBadgeSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    badge:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Badge"
    },

    earnedAt:{
        type:Date,
        default:Date.now
    }

});

export default mongoose.model(
    "UserBadge",
    userBadgeSchema
);