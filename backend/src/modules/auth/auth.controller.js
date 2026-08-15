import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import User from "../user/models/User.js";
import OTP from "./models/OTP.js";
import RefreshToken from "./models/RefreshToken.js";

import generateToken from "./services/generateToken.js";
import generateOTP from "./services/generateOTP.js";
import generateRefreshToken from "./services/generateRefreshToken.js";

import {
    safeSendActivityEmail,
    sendOTPEmail,
    sendResetPasswordOTP,
    sendWelcomeEmail
} from "../../infrastructure/email/email.service.js";

import logActivity from "../activity/logActivity.js";
import asyncHandler from "../../core/http/asyncHandler.js";
import AppError from "../../core/errors/AppError.js";

// ==========================================
// SIGNUP CONTROLLER (FAST RESPONSE)
// ==========================================
export const signup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new AppError("All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    // 1. Create User
    const user = await User.create({
        username,
        email,
        password,
    });

    // 2. Generate and Store OTP
    const otp = generateOTP();

    await OTP.deleteMany({ email });
    await OTP.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins expiry
    });

    // 3. Send Email in Background (Non-blocking: Bina await re)
    // Response stop hebanahi, background re mail deliver heba
    sendOTPEmail(email, otp).catch((error) => {
        console.error("❌ Signup OTP sending failed in background:", error.message);
    });

    safeSendActivityEmail(
        "welcome email",
        () => sendWelcomeEmail(user)
    );

    // 4. Log Activity
    await logActivity(
        req,
        user._id,
        "SIGNUP",
        "Auth",
        "User account created"
    );

    // 5. Instant Response (< 1 Second)
    return res.status(201).json({
        success: true,
        message: "Account created. OTP sent to your email.",
        email: email
    });
});

// ==========================================
// LOGIN CONTROLLER
// ==========================================
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Email and Password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    if (user.isBlocked) {
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: "Your account has been blocked."
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.isVerified) {
        throw new AppError("Please verify your email first.", 403);
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.deleteMany({ user: user._id });
    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
});

// ==========================================
// VERIFY OTP CONTROLLER
// ==========================================
export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp, purpose } = req.body;

    if (!email || !otp || !purpose) {
        throw new AppError("Email, OTP and purpose are required", 400);
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
        throw new AppError("Invalid OTP", 400);
    }

    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new AppError("OTP expired", 400);
    }

    if (otpRecord.otp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    if (purpose === "signup") {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.isVerified = true;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        await RefreshToken.create({
            user: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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

    if (purpose === "forgot-password") {
        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            email
        });
    }

    throw new AppError("Invalid OTP purpose", 400);
});

// ==========================================
// RESEND OTP CONTROLLER
// ==========================================
export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
        throw new AppError("Email already verified", 400);
    }

    const otp = generateOTP();

    await OTP.deleteMany({ email });
    await OTP.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send in background
    sendOTPEmail(email, otp).catch((error) => {
        console.error("❌ Resend OTP sending failed:", error.message);
    });

    return res.status(200).json({
        success: true,
        message: "OTP resent successfully"
    });
});

// ==========================================
// FORGOT PASSWORD CONTROLLER
// ==========================================
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const otp = generateOTP();

    await OTP.deleteMany({ email });
    await OTP.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send in background
    sendResetPasswordOTP(email, otp).catch((error) => {
        console.error("❌ Forgot password OTP sending failed:", error.message);
    });

    return res.status(200).json({
        success: true,
        message: "Password reset OTP sent"
    });
});

// ==========================================
// VERIFY RESET OTP
// ==========================================
export const verifyResetOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new AppError("Email and OTP are required", 400);
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
        throw new AppError("OTP not found", 400);
    }

    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new AppError("OTP expired", 400);
    }

    if (otpRecord.otp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    return res.status(200).json({
        success: true,
        message: "OTP verified successfully"
    });
});

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        throw new AppError("All fields are required", 400);
    }

    if (newPassword !== confirmPassword) {
        throw new AppError("Passwords do not match", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email });

    return res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
});

// ==========================================
// LOGOUT USER
// ==========================================
export const logoutUser = asyncHandler(async (req, res) => {
    await logActivity(
        req,
        req.user._id,
        "LOGOUT",
        "Auth",
        "User logged out"
    );

    await RefreshToken.deleteMany({ user: req.user._id });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
});

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new AppError("Refresh token required", 401);
    }

    const savedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!savedToken) {
        throw new AppError("Invalid refresh token", 401);
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
});

// ==========================================
// ADMIN LOGIN
// ==========================================
export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Email and Password are required", 400);
    }

    const admin = await User.findOne({
        email,
        role: "admin"
    }).select("+password");

    if (!admin) {
        throw new AppError("Admin not found", 401);
    }

    if (!admin.isVerified) {
        throw new AppError("Admin account is not verified", 403);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new AppError("Invalid password", 401);
    }

    const accessToken = generateToken(admin);
    const refreshToken = generateRefreshToken(admin);

    await RefreshToken.deleteMany({ user: admin._id });
    await RefreshToken.create({
        user: admin._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
