import express from "express";

import {protect} from "../../middleware/auth.middleware.js";

import authorizeRoles from "../../middleware/role.middleware.js";

import { studentDashboard, adminDashboard } from "../controllers/Dashboard/dashboard.controller.js";

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