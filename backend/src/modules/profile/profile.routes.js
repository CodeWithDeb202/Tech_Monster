import express from "express";

import { uploadProfileImage, updateProfile, getProfile, getUserProfile } from "../controllers/profile.controller.js";

import { protect } from "../../middleware/auth.middleware.js";

import upload  from "../../middleware/upload.middleware.js";


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