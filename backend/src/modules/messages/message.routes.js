import express from "express";

import { protect } from "../../core/security/auth.middleware.js";
import chatUpload from "../../infrastructure/storage/chatUpload.middleware.js";
import { uploadChatFile } from "./chatUpload.controller.js";

import {
    sendMessage,
    getMessages,
    getChatUsers,
    markAsSeen,
    deleteForMe,
    deleteForEveryone,
    searchMessages,
    getSharedFiles,
    getMessagesPaginated
} from "./message.controller.js";

const router = express.Router();

// Send Message
router.post(
    "/",
    protect,
    sendMessage
);

// Get All Chat Users
router.get(
    "/users",
    protect,
    getChatUsers
);

router.get(
    "/search/:userId",
    protect,
    searchMessages
);

router.get(
    "/shared/:userId",
    protect,
    getSharedFiles
);

router.get(
    "/page/:userId",
    protect,
    getMessagesPaginated
);


// Get Conversation
router.get(
    "/:userId",
    protect,
    getMessages
);

// Mark Messages as Seen
router.patch(
    "/seen/:userId",
    protect,
    markAsSeen
);

// Upload Chat File
router.post(
    "/upload",
    protect,
    chatUpload.single("file"),
    uploadChatFile
);

router.delete(

    "/me/:id",

    protect,

    deleteForMe

);

router.delete(

    "/everyone/:id",

    protect,

    deleteForEveryone

);


export default router;