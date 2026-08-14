import express from "express";

import {
    getLearningContent
} from "../controllers/learning.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";


const router = express.Router();


router.get(
    "/:type/:slug",
    protect,
    authorizeRoles("student"),
    getLearningContent
);


export default router;