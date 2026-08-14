import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Internship from "../models/Internship.js";
import StudentInternship from "../models/StudentInternship.js";
import Certificate from "../models/Certificate.js";
import UserBadge from "../models/UserBadge.js";

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


// =====================================
// GET OTHER USER PROFILE
// =====================================

export const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new AppError("User ID is required", 400);
    }

    const user = await User.findById(userId)
        .select("-password -refreshToken");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isBlocked) {
        throw new AppError("This user is not available", 403);
    }

    // =====================================
    // FOLLOW STATS
    // =====================================

    const followersCount = await Follow.countDocuments({
        following: userId
    });

    const followingCount = await Follow.countDocuments({
        follower: userId
    });

    // =====================================
    // IS CURRENT USER FOLLOWING TARGET USER?
    // =====================================

    const isFollowing = await Follow.exists({
        follower: req.user._id,
        following: userId
    });

    // =====================================
    // STUDENT INTERNSHIPS + COURSES
    // =====================================

    const enrollments = await StudentInternship.find({
        student: userId
    })
        .populate(
            "internship",
            "title slug category level"
        )
        .populate(
            "course",
            "title slug category level"
        )
        .sort({ createdAt: -1 });

    const internships = enrollments
        .filter(item => item.internship)
        .map(item => ({
            _id: item.internship._id,
            title: item.internship.title,
            slug: item.internship.slug,
            category: item.internship.category,
            level: item.internship.level,
            progress: item.progress,
            status: item.status,
            startedAt: item.startedAt,
            completedAt: item.completedAt,
            certificateIssued: item.certificateIssued
        }));

    const courses = enrollments
        .filter(item => item.course)
        .map(item => ({
            _id: item.course._id,
            title: item.course.title,
            slug: item.course.slug,
            category: item.course.category,
            level: item.course.level,
            progress: item.progress,
            status: item.status,
            startedAt: item.startedAt,
            completedAt: item.completedAt
        }));

    // =====================================
    // CERTIFICATES
    // =====================================

    const certificates = await Certificate.find({
        student: userId
    })
        .populate(
            "internship",
            "title slug"
        )
        .sort({ issueDate: -1 });

    // =====================================
    // BADGES
    // =====================================

    const badges = await UserBadge.find({
        user: userId
    })
        .populate("badge")
        .sort({ earnedAt: -1 });

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({
        success: true,

        user,

        stats: {
            followersCount,
            followingCount,
            isFollowing: Boolean(isFollowing)
        },

        internships,
        courses,
        certificates,
        badges
    });
});