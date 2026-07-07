import { Log } from "@/utils/logger";
import pdfService from "./pdf.service";

export interface InvoiceData {
  orderId: string;
  userId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  creditPack: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

class InvoiceService {
  async generateInvoiceHtml(data: InvoiceData): Promise<string> {
    Log.info("InvoiceService::generateInvoiceHtml:::: generating invoice HTML", { invoiceNumber: data.invoiceNumber });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #333; padding: 40px; }
    .invoice-container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: 700; color: #6366f1; }
    .invoice-title { font-size: 14px; color: #666; text-align: right; }
    .invoice-title h2 { font-size: 28px; color: #1a1a1a; margin-bottom: 5px; }
    .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .details div { flex: 1; }
    .details h3 { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px; letter-spacing: 1px; }
    .details p { font-size: 14px; line-height: 1.6; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #dee2e6; }
    .items-table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
    .total-section { text-align: right; margin-top: 20px; }
    .total-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
    .total-label { width: 150px; text-align: right; padding-right: 20px; font-size: 14px; color: #666; }
    .total-value { width: 100px; text-align: right; font-size: 14px; }
    .grand-total { font-size: 18px; font-weight: 700; color: #6366f1; border-top: 2px solid #6366f1; padding-top: 10px; margin-top: 10px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo">Job Hunter</div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <p>${data.invoiceNumber}</p>
        <p>${data.createdAt}</p>
      </div>
    </div>
    
    <div class="details">
      <div>
        <h3>Bill To</h3>
        <p><strong>${data.userName}</strong></p>
        <p>${data.userEmail}</p>
      </div>
      <div style="text-align: right;">
        <h3>Payment Details</h3>
        <p>Order ID: ${data.orderId}</p>
        <p>Currency: ${data.currency}</p>
      </div>
    </div>
    
    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Credit Pack: ${data.creditPack}</td>
          <td style="text-align: right;">${data.currency} ${data.amount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="total-section">
      <div class="total-row">
        <div class="total-label">Subtotal</div>
        <div class="total-value">${data.currency} ${data.amount.toFixed(2)}</div>
      </div>
      <div class="total-row">
        <div class="total-label">Tax</div>
        <div class="total-value">${data.currency} 0.00</div>
      </div>
      <div class="total-row grand-total">
        <div class="total-label">Total</div>
        <div class="total-value">${data.currency} ${data.amount.toFixed(2)}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for your purchase!</p>
      <p>Job Hunter - Your AI-powered job search companion</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    Log.info("InvoiceService::generateInvoiceHtml:::: invoice HTML generated");
    return html;
  }

  async generateInvoicePdf(html: string): Promise<Buffer> {
    Log.info("InvoiceService::generateInvoicePdf:::: generating PDF from HTML");
    const pdfBuffer = await pdfService.generatePdfFromHtml(html);
    Log.info("InvoiceService::generateInvoicePdf:::: PDF generated successfully");
    return pdfBuffer;
  }
}

export default new InvoiceService();