import express from "express";

import {getHeroStats} from "./public.controller.js";

const router = express.Router();

router.get("/hero-stats", getHeroStats);

export default router;