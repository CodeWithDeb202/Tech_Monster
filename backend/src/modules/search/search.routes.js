import express from "express";

import {
    searchInternships,
    searchUsers,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get(
    "/internships",
    searchInternships
);

router.get(
    "/users",
    searchUsers
);

export default router;
