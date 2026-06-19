import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import resumeController from "@/controllers/v2/resume.controller";
const router = express.Router();



// for resumes
// ###############################################

router.get("/:resumeId", apiErrorHandler(resumeController.generateResume));

export default router;
