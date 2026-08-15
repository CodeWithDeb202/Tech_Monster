import bcrypt from "bcrypt";
import OTP from "../models/OTP.js";
import User from "../models/user/User.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getCurrentUser = asyncHandler( async (req, res) => {

    const user = req.user;

    if (!user) {

        throw new AppError(
            "User not found",
            404
        )
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user,
    });

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

});


export const updateProfile = asyncHandler( async (req, res) => {

        const {
            firstName,
            lastName,
            phone,
            bio,
            college,
            skills,
            location,
            github,
            linkedin
        } = req.body;

        const user = await User.findByIdAndUpdate(

            req.user._id,

            {
                firstName,
                lastName,
                phone,
                bio,
                college,
                skills,
                location,
                github,
                linkedin
            },

            {
                new: true,
                runValidators: true
            }

        ).select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile updated successfully",

            user

        });

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });
});


export const changePassword = asyncHandler( async (req, res) => {

        const {

            currentPassword,

            newPassword

        } = req.body;

        if (!currentPassword || !newPassword) {

            throw new AppError(
                "All fields are required",
                400
            )

        }

        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!isMatch) {

            throw new AppError(
                "Current password is incorrect",
                400
            )

        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Password changed successfully"

        });

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

});


export const deleteAccount = asyncHandler( async (req, res) => {

        await OTP.deleteMany({

            email: req.user.email

        });

        await User.findByIdAndDelete(

            req.user._id

        );

        return res.status(200).json({

            success: true,

            message: "Account deleted successfully"

        });

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

});