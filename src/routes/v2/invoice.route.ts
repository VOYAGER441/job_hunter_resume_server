import express from "express";
import { apiErrorHandler } from "@/error/apiErrorHandler";
import invoiceController from "@/controllers/v2/invoice.controller";

const router = express.Router();

// Internal endpoint - requires internal service token
router.post("/generate", apiErrorHandler(invoiceController.generateInvoice));

export default router;