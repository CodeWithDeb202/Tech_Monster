import express from "express";

import {protect} from "../../core/security/auth.middleware.js";

import authorizeRoles from "../../core/security/role.middleware.js";

import {

    getDashboardAnalytics,
    getMonthlyAnalytics

} from "../analytics/analytics.controller.js";

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