import express from "express";

import { protect } from "../../core/security/auth.middleware.js";

import authorizeRoles from "../../core/security/role.middleware.js";

import { serverStatus } from "./server.controller.js";

const router = express.Router();

router.get(
    "/status",
    protect,
    authorizeRoles("admin"),
    serverStatus
);

export default router;