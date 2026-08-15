import express from "express";

import {protect} from "../../middleware/auth.middleware.js";

import authorizeRoles from "../../middleware/role.middleware.js";

import {

    getDashboardAnalytics,
    getMonthlyAnalytics

} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(

    "/dashboard",

    protect,

    authorizeRoles("admin"),

    getDashboardAnalytics

);

router.get(

    "/monthly",

    protect,

    authorizeRoles("admin"),

    getMonthlyAnalytics

);

export default router;