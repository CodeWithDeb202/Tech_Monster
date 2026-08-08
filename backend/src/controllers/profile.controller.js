import User from "../models/User.js";
import uploadToCloudinary from "../utils/uploadCloudinary.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


export const uploadProfileImage = asyncHandler(async (req, res) => {
    console.log("req.file", req.file);


    if (!req.file) {

        throw new AppError(
            "Please upload an image",
            400
        )

    }


    const imageUrl = await uploadToCloudinary(
        req.file,
        "tech-monster/profile"
    );



    const user = await User.findByIdAndUpdate(

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

        message: "Profile image uploaded successfully",

        user

    });

});


export const updateProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new AppError("User not found", 404);
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


    allowedFields.forEach((field) => {

        if (req.body[field] !== undefined) {

            user[field] = req.body[field];

        }

    });

    user.profileCompleted = true;

    await user.save();

    res.status(200).json({

        success: true,

        message: "Profile updated",

        user

    });

});


export const getProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)
        .select("-password");

    res.json({

        success: true,

        user

    });

});