import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import OTP from "../models/OTP.js";
import generateOTP from "../utils/generateOTP.js";
import { sendOTPEmail, sendResetPasswordOTP } from "../services/email.service.js";
import logActivity from "../utils/logActivity.js";
import RefreshToken from "../models/RefreshToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";



export const signup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // ==========================================
    // Validation
    // ==========================================

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // ==========================================
    // Existing User Check
    // ==========================================

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError(
            "Email already exists",
            409
        );
    }

    // ==========================================
    // Create User
    // ==========================================

    const user = await User.create({
        username,
        email,
        password,
    });

    // ==========================================
    // Generate OTP
    // ==========================================

    const otp = generateOTP();

    await OTP.deleteMany({
        email,
    });

    await OTP.create({
        email,
        otp,
        expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
        ),
    });

    // ==========================================
    // Send OTP Email
    // ==========================================

    try {
        await sendOTPEmail(
            email,
            otp
        );
    } catch (error) {
        console.error(
            "❌ Signup OTP sending failed:",
            error.message
        );

        // Cleanup user if email failed
        await OTP.deleteMany({
            email,
        });

        await User.deleteOne({
            _id: user._id,
        });

        throw new AppError(
            "Unable to send OTP email. Please try again.",
            500
        );
    }

    // ==========================================
    // Activity Log
    // ==========================================

    await logActivity(
        req,
        user._id,
        "SIGNUP",
        "Auth",
        "User account created"
    );

    // ==========================================
    // Success Response
    // ==========================================

    return res.status(201).json({
        success: true,
        message: "Account created. OTP sent to your email.",
    });
});



export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        throw new AppError(

            "Email and Password are required",

            400

        );

    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError(

            "Invalid email or password",

            401

        );
    }

    // ===============================
    // Account Block Check
    // ===============================

    if (user.isBlocked) {

        return res.status(403).json({

            success: false,

            statusCode: 403,

            message: "Your account has been blocked."

        });

    }

    // ===============================
    // Password Check
    // ===============================

    const isMatch = await bcrypt.compare(

        password,

        user.password

    );

    if (!isMatch) {
        throw new AppError(

            "Invalid email or password",

            401

        );
    }


    if (!user.isVerified) {

        throw new AppError(

            "Please verify your email first.",

            403

        );
    }

    if (user.isBlocked) {

        throw new AppError(

            "Your account has been blocked. Please contact support.",

            403

        );

    }
    const accessToken = generateToken(user);

    const refreshToken = generateRefreshToken(user);
    await RefreshToken.deleteMany({

        user: user._id

    });

    await RefreshToken.create({

        user: user._id,

        token: refreshToken,

        expiresAt: new Date(

            Date.now() + 7 * 24 * 60 * 60 * 1000

        )

    });

    await logActivity(

        req,

        user._id,

        "LOGIN",

        "Auth",

        "User logged in successfully"

    );

    return res.status(200).json({

        success: true,

        message: "Login successful",

        accessToken,

        refreshToken,

        user: {
            id: user._id,
            username: user.username,
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }

    });


    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });

});


export const verifyOTP = asyncHandler(async (req, res) => {


    const {
        email,
        otp,
        purpose
    } = req.body;



    // ==========================================
    // Validation
    // ==========================================

    if (!email || !otp || !purpose) {

        return res.status(400).json({

            success: false,

            message: "Email, OTP and purpose are required"

        });

    }



    // ==========================================
    // Find OTP
    // ==========================================

    const otpRecord = await OTP.findOne({

        email

    });



    if (!otpRecord) {

        throw new AppError(

            "Invalid OTP",

            400

        );

    }




    // ==========================================
    // OTP Expiry Check
    // ==========================================

    if (otpRecord.expiresAt < new Date()) {


        await OTP.deleteOne({

            _id: otpRecord._id

        });


        throw new AppError(

            "OTP expired",

            400

        );

    }




    // ==========================================
    // OTP Match
    // ==========================================

    if (otpRecord.otp !== otp) {


        throw new AppError(

            "Invalid OTP",

            400

        );

    }




    // =================================================
    // SIGNUP OTP VERIFICATION
    // =================================================

    if (purpose === "signup") {


        const user = await User.findOne({

            email

        });



        if (!user) {


            throw new AppError(

                "User not found",

                404

            );


        }



        user.isVerified = true;


        await user.save();



        await OTP.deleteOne({

            _id: otpRecord._id

        });



        // Generate JWT Token

        const accessToken = generateToken(user);



        const refreshToken = generateRefreshToken(user);



        await RefreshToken.create({

            user: user._id,

            token: refreshToken,

            expiresAt: new Date(

                Date.now() +
                7 * 24 * 60 * 60 * 1000

            )

        });




        await logActivity(

            req,

            user._id,

            "VERIFY_EMAIL",

            "Auth",

            "Email verified successfully"

        );




        return res.status(200).json({


            success: true,


            message: "Email verified successfully",



            accessToken,


            refreshToken,



            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }



        });



    }





    // =================================================
    // FORGOT PASSWORD OTP VERIFICATION
    // =================================================

    if (purpose === "forgot-password") {



        await OTP.deleteOne({

            _id: otpRecord._id

        });



        return res.status(200).json({


            success: true,


            message: "OTP verified successfully",


            email


        });


    }





    // =================================================
    // INVALID PURPOSE
    // =================================================


    throw new AppError(

        "Invalid OTP purpose",

        400

    );


});



export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;


    if (!email) {

        return res.status(400).json({
            success: false,
            message: "Email is required"
        });

    }


    const user = await User.findOne({ email });


    if (!user) {

        return res.status(404).json({
            success: false,
            message: "User not found"
        });

    }


    if (user.isVerified) {

        return res.status(400).json({
            success: false,
            message: "Email already verified"
        });

    }


    const otp = generateOTP();


    // old OTP delete

    await OTP.deleteMany({
        email
    });


    // new OTP create

    await OTP.create({

        email,
        otp,
        expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
        )

    });



    await sendOTPEmail(
        email,
        otp
    );


    return res.status(200).json({

        success: true,
        message: "OTP resent successfully"

    });


    return res.status(500).json({

        success: false,
        message: "Internal Server Error"

    });

});


export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });

        }


        const user = await User.findOne({ email });


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        const otp = generateOTP();


        // Remove old OTP

        await OTP.deleteMany({
            email
        });



        // Create reset OTP

        await OTP.create({

            email,
            otp,
            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            )

        });



        await sendOTPEmail(
            email,
            otp
        );

        await sendResetPasswordOTP(
            email,
            otp
        );



        return res.status(200).json({

            success: true,
            message: "Password reset OTP sent"

        });



    } catch (error) {

        console.log(error);


        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};


export const verifyResetOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;


        if (!email || !otp) {

            return res.status(400).json({

                success: false,
                message: "Email and OTP are required"

            });

        }



        const otpRecord = await OTP.findOne({
            email
        });



        if (!otpRecord) {

            return res.status(400).json({

                success: false,
                message: "OTP not found"

            });

        }



        if (otpRecord.expiresAt < new Date()) {


            await OTP.deleteOne({
                _id: otpRecord._id
            });


            return res.status(400).json({

                success: false,
                message: "OTP expired"

            });


        }



        if (otpRecord.otp !== otp) {


            return res.status(400).json({

                success: false,
                message: "Invalid OTP"

            });


        }



        return res.status(200).json({

            success: true,
            message: "OTP verified successfully"

        });



    } catch (error) {


        console.log(error);


        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });


    }

};


export const resetPassword = async (req, res) => {

    try {

        const {
            email,
            newPassword,
            confirmPassword
        } = req.body;



        if (!email || !newPassword || !confirmPassword) {

            return res.status(400).json({

                success: false,
                message: "All fields are required"

            });

        }



        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                success: false,
                message: "Passwords do not match"

            });

        }



        const user = await User.findOne({ email });



        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }



        // Update password
        user.password = newPassword;


        await user.save();



        // Delete used OTP

        await OTP.deleteMany({
            email
        });



        return res.status(200).json({

            success: true,
            message: "Password reset successfully"

        });



    } catch (error) {


        console.log(error);



        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });


    }

};



export const logoutUser = async (req, res) => {

    try {

        await logActivity(

            req,

            req.user._id,

            "LOGOUT",

            "Auth",

            "User logged out"

        );

        await RefreshToken.deleteMany({

            user: req.user._id

        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });

    }

};


export const refreshAccessToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {

        throw new AppError(

            "Refresh token required",

            401

        );

    }

    const savedToken = await RefreshToken.findOne({

        token: refreshToken

    });

    if (!savedToken) {

        throw new AppError(

            "Invalid refresh token",

            401

        );

    }

    const decoded = jwt.verify(

        refreshToken,

        process.env.JWT_REFRESH_SECRET

    );

    const accessToken = generateToken(decoded.id);

    return res.status(200).json({

        success: true,

        accessToken

    });

    throw new AppError(

        "Refresh token expired",

        401

    );

});



export const adminLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        throw new AppError(
            "Email and Password are required",
            400
        );

    }

    const admin = await User.findOne({
        email,
        role: "admin"
    }).select("+password");

    if (!admin.isVerified) {
        throw new AppError("Admin account is not verified", 403);
    }

    if (!admin) {

        throw new AppError(
            "Admin not found",
            401
        );

    }


    const isMatch = await bcrypt.compare(
        password,
        admin.password
    );

    if (!isMatch) {

        throw new AppError(
            "Invalid password",
            401
        );

    }

    const accessToken = generateToken(admin);

    const refreshToken = generateRefreshToken(admin);

    await RefreshToken.deleteMany({
        user: admin._id
    });

    await RefreshToken.create({

        user: admin._id,
        token: refreshToken,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )

    });

    return res.status(200).json({

        success: true,

        accessToken,

        refreshToken,

        user: {

            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role

        }

    });

});