import express from "express";
import routerResume from "./resume.route";

const router= express.Router();

// TODO: add middleware to all routes

// system routes
// ###############################################

router.use("/resume", routerResume);

export default router;