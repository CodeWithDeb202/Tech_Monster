import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Internship from "../models/Internship.js";
import StudentInternship from "../models/StudentInternship.js";

import uploadToCloudinary from "../utils/uploadCloudinary.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


// =====================================
// PROFILE STATS
// =====================================

const getProfileStats = async (userId) => {

    const followersCount =
        await Follow.countDocuments({
            following: userId
        });


    const followingCount =
        await Follow.countDocuments({
            follower: userId
        });


    const completedInternships =
        await StudentInternship.countDocuments({

            student: userId,

            status: "Completed"

        });


    const totalInternships =
        await Internship.countDocuments({

            isPublished: true

        });


    return {

        followersCount,
        followingCount,
        completedInternships,
        totalInternships

    };

};


// =====================================
// UPLOAD PROFILE IMAGE
// =====================================

export const uploadProfileImage = asyncHandler(
    async (req, res) => {

        console.log(
            "req.file",
            req.file
        );


        if (!req.file) {

            throw new AppError(
                "Please upload an image",
                400
            );

        }


        const imageUrl =
            await uploadToCloudinary(
                req.file,
                "tech-monster/profile"
            );


        const user =
            await User.findByIdAndUpdate(

                req.user.id,

                {
                    avatar: imageUrl
                },

                {
                    new: true
                }

            );


        res.status(200).json({

            success: true,

            message:
                "Profile image uploaded successfully",

            user

        });

    }
);


// =====================================
// UPDATE PROFILE
// =====================================

export const updateProfile = asyncHandler(
    async (req, res) => {

        const user =
            await User.findById(
                req.user._id
            );


        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        const allowedFields = [

            "firstName",
            "middleName",
            "lastName",

            "phone",
            "bio",
            "gender",
            "dateOfBirth",

            "education",
            "college",
            "branch",
            "year",
            "semester",

            "github",
            "linkedin",
            "skills",

            "currentAddress",
            "localAddress",
            "district",
            "state",
            "pincode"

        ];


        allowedFields.forEach(
            (field) => {

                if (
                    req.body[field] !==
                    undefined
                ) {

                    user[field] =
                        req.body[field];

                }

            }
        );


        user.profileCompleted = true;


        await user.save();


        const stats =
            await getProfileStats(
                user._id
            );


        res.status(200).json({

            success: true,

            message:
                "Profile updated",

            user,

            stats

        });

    }
);


// =====================================
// GET PROFILE
// =====================================

export const getProfile = asyncHandler(
    async (req, res) => {

        const user =
            await User.findById(
                req.user._id
            )
                .select("-password");


        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        const stats =
            await getProfileStats(
                user._id
            );


        res.status(200).json({

            success: true,

            user,

            stats

        });

    }
);