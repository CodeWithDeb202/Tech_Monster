import express from "express";

import { uploadProfileImage, updateProfile, getProfile, getUserProfile } from "./profile.controller.js";
import { protect } from "../../core/security/auth.middleware.js";
import upload  from "../../infrastructure/storage/upload.middleware.js";

const router = express.Router();

router.put(
    "/profile-image",
    protect,
    upload.single("avatar"),
    uploadProfileImage
);

router.get(
    "/",
    protect,
    getProfile
);

router.get(
    "/user/:userId",
    protect,
    getUserProfile
);

router.put(
    "/",
    protect,
    updateProfile
);



export default router;