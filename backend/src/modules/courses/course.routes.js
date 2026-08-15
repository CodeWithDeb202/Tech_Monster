import express from "express";

import {
    createCourse,
    getAllCourses,
    getSingleCourse,
    joinCourse,
    getMyCourses,
    updateCourseProgress,
    completeCourse,
    completeLesson,
    getCompletedLessons,
    updateCourse,
    deleteCourse
} from "../controllers/course.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    upload.single("img"),
    createCourse
);

router.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    upload.single("img"),
    updateCourse
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteCourse
);

router.get("/", getAllCourses);
router.get("/slug/:slug", getSingleCourse);
router.get("/:id", getSingleCourse);

router.post(
    "/slug/:slug/complete-lesson",
    protect,
    authorizeRoles("student"),
    completeLesson
);

router.get(
    "/slug/:slug/completed-lessons",
    protect,
    authorizeRoles("student"),
    getCompletedLessons
);

router.post(
    "/:id/join",
    protect,
    authorizeRoles("student"),
    joinCourse
);

router.get(
    "/student/my",
    protect,
    authorizeRoles("student"),
    getMyCourses
);

router.put(
    "/:id/progress",
    protect,
    authorizeRoles("student"),
    updateCourseProgress
);

router.put(
    "/:id/complete",
    protect,
    authorizeRoles("student"),
    completeCourse
);

export default router;
