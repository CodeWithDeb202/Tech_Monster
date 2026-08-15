import express from "express";
import { signup, login, verifyOTP, resendOTP, forgotPassword, verifyResetOTP, resetPassword, logoutUser, adminLogin, } from "./auth.controller.js";
import { loginLimiter, registerLimiter, forgotPasswordLimiter, otpLimiter } from "../../core/security/rateLimiter.middleware.js";
import validate from "../../core/validation/validate.middleware.js";
import { protect } from "../../core/security/auth.middleware.js";

import {registerSchema, loginSchema } from "./auth.validation.js";


const router = express.Router();

router.post("/signup", registerLimiter, validate(registerSchema), signup);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", otpLimiter, resendOTP);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/logout", protect, logoutUser);
router.post("/admin/login", loginLimiter, adminLogin);


export default router;