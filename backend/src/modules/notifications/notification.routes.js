import express from "express";

import { protect } from "../../core/security/auth.middleware.js";
import authorizeRoles from "../../core/security/role.middleware.js";

import {
    sendNotification,
    getMyNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead
} from "./notification.controller.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    sendNotification
);

router.get(
    "/",
    protect,
    getMyNotifications
);

router.patch(
    "/read-all",
    protect,
    markAllAsRead
);

router.patch(
    "/:id/read",
    protect,
    markAsRead
);

router.delete(
    "/:id",
    protect,
    deleteNotification
);

export default router;