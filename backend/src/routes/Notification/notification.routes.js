import express from "express";

import { protect } from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

import {
    sendNotification,
    getMyNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead
} from "../../controllers/Notification/notification.controller.js";

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