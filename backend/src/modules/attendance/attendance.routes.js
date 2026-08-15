import express from "express";

import { protect } from "../../core/security/auth.middleware.js";

import authorizeRoles from "../../core/security/role.middleware.js";

import {

    checkIn,

    checkOut,

    getMyAttendance,

    getInternAttendance

} from "./attendance.controller.js";

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