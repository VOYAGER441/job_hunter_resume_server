import puppeteer, { Browser } from "puppeteer";
import { Log } from "@/utils/logger";

class PdfService {
    private browser: Browser | null = null;

    // Lazily launch and reuse a single browser instance across requests
    private async getBrowser(): Promise<Browser> {
        if (this.browser && this.browser.connected) {
            return this.browser;
        }
        Log.info("PdfService:::getBrowser:::: launching new browser instance");
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage", // avoids /dev/shm crashes in Docker
            ],
        });
        return this.browser;
    }

    async generatePdfFromHtml(html: string): Promise<Buffer> {
        Log.info("PdfService:::generatePdfFromHtml:::: starting PDF generation");
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        try {
            await page.setContent(html, {
                waitUntil: "domcontentloaded",
            });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
            });

            Log.info("PdfService:::generatePdfFromHtml:::: PDF generated successfully");
            return Buffer.from(pdfBuffer);
        } catch (error) {
            Log.error("PdfService:::generatePdfFromHtml:::: failed to generate PDF", error);
            throw new Error("Failed to generate PDF from HTML");
        } finally {
            await page.close(); // always close the page, even on failure
        }
    }

    async closeBrowser(): Promise<void> {
        if (this.browser) {
            Log.info("PdfService:::closeBrowser:::: closing browser instance");
            await this.browser.close();
            this.browser = null;
        }
    }
}

export default new PdfService();