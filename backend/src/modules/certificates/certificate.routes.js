import express from "express";

import {
    issueCertificate,
    getMyCertificates,
    downloadCertificate

} from "./certificate.controller.js";


import { protect } from "../../core/security/auth.middleware.js";


const router = express.Router();



router.post(
    "/issue",
    protect,
    issueCertificate
);



router.get(
    "/my",
    protect,
    getMyCertificates
);



router.get(
    "/download/:id",
    protect,
    downloadCertificate
);



export default router;