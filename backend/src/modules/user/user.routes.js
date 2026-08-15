import express from "express";
import {protect} from "../../middleware/auth.middleware.js";
import { getCurrentUser, updateProfile, changePassword, deleteAccount } from "../controllers/user.controller.js";

const router = express.Router();



router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;