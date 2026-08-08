import express from "express";

import {
    getHeroStats
} from "../../controllers/LandingPage/public.controller";

const router = express.Router();

router.get("/hero-stats", getHeroStats);

export default router;