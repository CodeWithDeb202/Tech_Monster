import express from "express";

import { protect } from "../core/security/auth.middleware.js";
import authorizeRoles from "../core/security/role.middleware.js";

import {
    getAllSubmissions,
    getSubmissionDetails,
    approveSubmission,
    rejectSubmission,
    extendSubmissionDeadline
} from "./submission.controller.js";

const router = express.Router();

// Admin reviews all student code submissions
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllSubmissions
);

// Admin views a single submission
router.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    getSubmissionDetails
);

// Admin approves a submission
router.put(
    "/:id/approve",
    protect,
    authorizeRoles("admin"),
    approveSubmission
);

// Admin rejects a submission
router.put(
    "/:id/reject",
    protect,
    authorizeRoles("admin"),
    rejectSubmission
);

// Admin extends/reactivates a student's task deadline
router.put(
    "/:id/extend",
    protect,
    authorizeRoles("admin"),
    extendSubmissionDeadline
);

export default router;
