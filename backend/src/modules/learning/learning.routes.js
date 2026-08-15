import express from "express";

import {getLearningContent} from "../learning/learning.controller.js";

import { protect } from "../../core/security/auth.middleware.js";
import authorizeRoles from "../../core/security/role.middleware.js";

const router = express.Router();

router.get(
    "/:type/:slug",
    protect,
    authorizeRoles("student"),
    getLearningContent
);


export default router;