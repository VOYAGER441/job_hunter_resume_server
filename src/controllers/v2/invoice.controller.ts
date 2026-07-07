import { Request, Response } from "express";
import { Log } from "@/utils/logger";
import invoiceService, { InvoiceData } from "@/services/invoice.service";
import env from "@/environment";

class InvoiceController {
  async generateInvoice(req: Request, res: Response) {
    // const token = req.headers["x-internal-token"];
    // if (token !== env.INVOICE_SERVICE_INTERNAL_TOKEN) {
    //   Log.error("InvoiceController::generateInvoice:::: unauthorized access attempt");
    //   res.status(401).json({ success: false, message: "Unauthorized" });
    //   return;
    // }
    Log.info("InvoiceController::generateInvoice:::: request received");

    const data: InvoiceData = req.body;
    
    if (!data.invoiceNumber || !data.amount || !data.userName || !data.userEmail) {
      Log.error("InvoiceController::generateInvoice:::: missing required fields");
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    try {
      Log.info("InvoiceController::generateInvoice:::: generating invoice", { invoiceNumber: data.invoiceNumber });
      
      const html = await invoiceService.generateInvoiceHtml(data);
      const pdfBuffer = await invoiceService.generateInvoicePdf(html);
      
      Log.info("InvoiceController::generateInvoice:::: invoice generated successfully", { invoiceNumber: data.invoiceNumber });
      
      res.status(200).json({ 
        success: true, 
        data: { 
          pdfBuffer: pdfBuffer.toString("base64"),
          invoiceNumber: data.invoiceNumber 
        } 
      });
    } catch (error) {
      Log.error("InvoiceController::generateInvoice:::: error generating invoice", error);
      res.status(500).json({ success: false, message: "Failed to generate invoice" });
    }
  }
}

export default new InvoiceController();