import express from "express";

import { protect } from "../../middleware/auth.middleware.js";

import authorizeRoles from "../../middleware/role.middleware.js";

import {

    checkIn,

    checkOut,

    getMyAttendance,

    getInternAttendance

} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post(
    "/check-in",
    protect,
    authorizeRoles("student"),
    checkIn
);

router.put(
    "/check-out/:id",
    protect,
    authorizeRoles("student"),
    checkOut
);

router.get(
    "/my-attendance",
    protect,
    authorizeRoles("student"),
    getMyAttendance
);

router.get(
    "/internship/:id",

    protect,
    authorizeRoles("employer"),
    getInternAttendance
);

export default router;