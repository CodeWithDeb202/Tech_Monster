import express from "express";

import {protect} from "../../core/security/auth.middleware.js";
import authorizeRoles from "../../core/security/role.middleware.js";

import { studentDashboard, adminDashboard } from "./dashboard.controller.js";

const router = express.Router();

router.get(
    "/student",
    protect,
    authorizeRoles("student"),
    studentDashboard
);

router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    adminDashboard
);

export default router;