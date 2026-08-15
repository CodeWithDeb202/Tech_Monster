import express from "express";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} from "../../controllers/Follow/follow.controller.js";

import { protect } from "../../middleware/auth.middleware.js";


const router = express.Router();


// =====================================
// FOLLOW
// =====================================

router.post(
    "/:userId",
    protect,
    followUser
);


// =====================================
// UNFOLLOW
// =====================================

router.delete(
    "/:userId",
    protect,
    unfollowUser
);


// =====================================
// FOLLOWERS
// =====================================

router.get(
    "/:userId/followers",
    protect,
    getFollowers
);


// =====================================
// FOLLOWING
// =====================================

router.get(
    "/:userId/following",
    protect,
    getFollowing
);


export default router;