import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import resumeController from "@/controllers/v2/resume.controller";
const router = express.Router();



// for resumes
// ###############################################

// build
router.get("/generate/:resumeId", apiErrorHandler(resumeController.generateResume));

// final build and store in s3
router.post("/generateAndStore/:resumeId", apiErrorHandler(resumeController.generateAndStoreResume));

export default router;
