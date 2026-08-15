import express from "express";

import { protect } from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

import {
    submitCode,
    getMySubmissions,
    getMyCourseSubmissions
} from "../controllers/submission.controller.js";

const router = express.Router();

// Student submits code for a task
router.post(
    "/",
    protect,
    authorizeRoles("student"),
    submitCode
);

// Student's own submissions
router.get(
    "/my",
    protect,
    authorizeRoles("student"),
    getMySubmissions
);

// Student's submissions for a specific course
router.get(
    "/course/:courseSlug",
    protect,
    authorizeRoles("student"),
    getMyCourseSubmissions
);

export default router;
