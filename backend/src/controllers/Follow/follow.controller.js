import Follow from "../../models/Follow.js";
import User from "../../models/User.js";

import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";


// =====================================
// FOLLOW USER
// =====================================

export const followUser = asyncHandler(
    async (req, res) => {

        const followerId = req.user._id;
        const followingId = req.params.userId;


        if (
            followerId.toString() ===
            followingId.toString()
        ) {
            throw new AppError(
                "You cannot follow yourself",
                400
            );
        }


        const user =
            await User.findById(followingId);

        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        const existingFollow =
            await Follow.findOne({
                follower: followerId,
                following: followingId
            });


        if (existingFollow) {

            throw new AppError(
                "Already following this user",
                400
            );

        }


        await Follow.create({
            follower: followerId,
            following: followingId
        });


        res.status(201).json({

            success: true,

            message: "User followed successfully"

        });

    }
);


// =====================================
// UNFOLLOW USER
// =====================================

export const unfollowUser = asyncHandler(
    async (req, res) => {

        const followerId = req.user._id;
        const followingId = req.params.userId;


        const follow =
            await Follow.findOneAndDelete({

                follower: followerId,
                following: followingId

            });


        if (!follow) {

            throw new AppError(
                "You are not following this user",
                404
            );

        }


        res.status(200).json({

            success: true,

            message: "User unfollowed successfully"

        });

    }
);


// =====================================
// GET FOLLOWERS
// =====================================

export const getFollowers = asyncHandler(
    async (req, res) => {

        const userId = req.params.userId;


        const followers =
            await Follow.find({

                following: userId

            })
                .populate(
                    "follower",
                    "username firstName lastName avatar"
                );


        res.status(200).json({

            success: true,

            followers

        });

    }
);


// =====================================
// GET FOLLOWING
// =====================================

export const getFollowing = asyncHandler(
    async (req, res) => {

        const userId = req.params.userId;


        const following =
            await Follow.find({

                follower: userId

            })
                .populate(
                    "following",
                    "username firstName lastName avatar"
                );


        res.status(200).json({

            success: true,

            following

        });

    }
);