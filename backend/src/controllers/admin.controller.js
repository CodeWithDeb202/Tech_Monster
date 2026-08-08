import User from "../models/User.js";
import Message from "../models/Message.js";
import Certificate from "../models/Certificate.js";
import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import Attendance from "../models/Attendance.js";
import StudentInternship from "../models/StudentInternship.js";
import Internship from "../models/Internship.js";

import logActivity from "../utils/logActivity.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


export const getDashboardStats = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
        role: "student"
    });

    const totalAdmins = await User.countDocuments({
        role: "admin"
    });

    const totalInternships = await Internship.countDocuments();

    const activeInternships = await Internship.countDocuments({
        isPublished: true
    });

    return res.status(200).json({

        success: true,

        stats: {

            totalUsers,
            totalStudents,
            totalEmployers,
            totalAdmins,
            totalCompanies,
            verifiedCompanies,
            totalInternships,
            activeInternships,
            totalApplications

        }

    });

});


export const getAllUsers = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";

    const role = req.query.role || "";

    const query = {};

    if (search) {

        query.$or = [

            {

                firstName: {

                    $regex: search,

                    $options: "i"

                }

            },

            {

                lastName: {

                    $regex: search,

                    $options: "i"

                }

            },

            {

                email: {

                    $regex: search,

                    $options: "i"

                }

            }

        ];

    }

    if (role) {

        query.role = role;

    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)

        .select("-password")

        .sort({

            createdAt: -1

        })

        .skip((page - 1) * limit)

        .limit(limit);

    return res.status(200).json({

        success: true,

        currentPage: page,

        totalPages: Math.ceil(totalUsers / limit),

        totalUsers,

        users

    });

});



export const blockUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {

        throw new AppError(

            "User not found",

            404

        );

    }

    if (user.role === "admin") {

        throw new AppError(

            "Admin account cannot be blocked",

            403

        );

    }

    user.isBlocked = true;

    await user.save();

    await logActivity(

        req,

        req.user._id,

        "BLOCK_USER",

        "Admin",

        `Blocked user: ${user.email}`

    );

    return res.status(200).json({

        success: true,

        message: "User blocked successfully",

        user

    });

});


export const unblockUser = asyncHandler(async (req, res) => {

    const user = await User.findById(

        req.params.id

    );

    if (!user) {

        throw new AppError(

            "User not found",

            404

        );

    }

    user.isBlocked = false;

    await user.save();

    await logActivity(

        req,

        req.user._id,

        "UNBLOCK_USER",

        "Admin",

        `Unblocked user: ${user.email}`

    );

    return res.status(200).json({

        success: true,

        message: "User unblocked successfully",

        user

    });

});


export const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(

        req.params.id

    );

    if (!user) {

        throw new AppError(

            "User not found",

            404

        );

    }

    if (user.role === "admin") {

        throw new AppError(

            "Admin account cannot be deleted",

            403

        );

    }

    await StudentInternship.deleteMany({
        student: user._id
    });

    await Task.deleteMany({
        student: user._id
    });

    await Attendance.deleteMany({
        student: user._id
    });

    await Notification.deleteMany({
        user: user._id
    });

    await Message.deleteMany({

        $or: [

            {

                sender: user._id

            },

            {

                receiver: user._id

            }

        ]

    });

    await Certificate.deleteMany({

        student: user._id

    });

    await User.findByIdAndDelete(

        user._id

    );

    await logActivity(

        req,

        req.user._id,

        "DELETE_USER",

        "Admin",

        `Deleted user: ${user.email}`

    );

    return res.status(200).json({

        success: true,

        message: "User deleted successfully"

    });

});


export const getSingleUser = asyncHandler(async (req, res) => {

    const student = await User.findById(req.params.id)
        .select("-password -refreshToken");

    if (!student) {
        throw new AppError("Student not found", 404);
    }

    const internships = await StudentInternship.find({
        student: student._id
    }).populate(
        "internship",
        "title duration level"
    );

    const attendance = await Attendance.find({
        student: student._id
    }).sort({
        createdAt: -1
    });

    const tasks = await Task.find({
        student: student._id
    }).sort({
        createdAt: -1
    });

    const notifications = await Notification.find({
        user: student._id
    })
    .sort({
        createdAt: -1
    })
    .limit(10);

    res.status(200).json({

        success: true,

        student,

        internships,

        attendance,

        tasks,

        notifications

    });

});


// backend/controllers/admin.controller.js

export const updateUser = asyncHandler(async (req, res) => {

    const student = await User.findById(req.params.id);

    if (!student) {
        throw new AppError("Student not found", 404);
    }

    const {
        firstName,
        middleName,
        lastName,
        username,
        email,
        phone,
        bio,
        gender,
        dateOfBirth,
        education,
        college,
        branch,
        year,
        semester,
        github,
        linkedin,
        skills,
        currentAddress,
        localAddress,
        district,
        state,
        pincode
    } = req.body;

    student.firstName = firstName ?? student.firstName;
    student.middleName = middleName ?? student.middleName;
    student.lastName = lastName ?? student.lastName;

    student.username = username ?? student.username;
    student.email = email ?? student.email;

    student.phone = phone ?? student.phone;

    student.bio = bio ?? student.bio;

    student.gender = gender ?? student.gender;

    student.dateOfBirth = dateOfBirth ?? student.dateOfBirth;

    student.education = education ?? student.education;
    student.college = college ?? student.college;
    student.branch = branch ?? student.branch;
    student.year = year ?? student.year;
    student.semester = semester ?? student.semester;

    student.github = github ?? student.github;
    student.linkedin = linkedin ?? student.linkedin;

    student.skills = skills ?? student.skills;

    student.currentAddress =
        currentAddress ?? student.currentAddress;

    student.localAddress =
        localAddress ?? student.localAddress;

    student.district =
        district ?? student.district;

    student.state =
        state ?? student.state;

    student.pincode =
        pincode ?? student.pincode;

    await student.save();

    res.status(200).json({

        success: true,

        message: "Student updated successfully",

        student

    });

});
