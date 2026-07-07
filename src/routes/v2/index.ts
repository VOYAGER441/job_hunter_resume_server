import express from "express";
import routerResume from "./resume.route";
import routerInvoice from "./invoice.route";

const router = express.Router();

// TODO: add middleware to all routes

// system routes
// ###############################################

router.use("/resume", routerResume);

// internal routes
router.use("/internal/invoice", routerInvoice);

export default router;