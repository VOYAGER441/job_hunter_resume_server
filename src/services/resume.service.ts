import env from "@/environment";
import { IResumeResponse } from "@/interface/response/resume.response";
import utils from "@/utils";
import { Log } from "@/utils/logger";
import { Mistral } from '@mistralai/mistralai';
import sanitizeHtml from "sanitize-html";
import pdfService from "./pdf.service";
import { IResumeRequest } from "@/interface/request/resume.request";
import mongoose from "mongoose";
import resumeModel, { IResume } from "@/models/resume.model";
import storageService from "./storage.service";
import axios from "axios";

class ResumeService {
    private client: Mistral;
    constructor() {
        Log.info("ResumeService::::: constructor::::: ResumeService initialized");
        this.client = new Mistral({ apiKey: env.MISTRAL_API_KEY });
    }

    // #################### system function ###########################
    async buildResume(resumeData: IResumeRequest): Promise<string> {
        Log.info("ResumeService::::: buildResume::::: building resume started");
        try {
            // call the db with id 
            const resumeDbData = await this._getResumeDataFromDb(new mongoose.Types.ObjectId(resumeData.resumeId));
            if (!resumeDbData) {
                Log.error("ResumeService::::: buildResume::::: no resume found in DB for id:", resumeData.resumeId);
                throw new Error("Resume not found");
            }
            Log.info("ResumeService::::: buildResume::::: resume data retrieved from DB successfully");

            const htmlContent = await this._callLlmForResumeHtml(resumeDbData);
            Log.info("ResumeService::::: buildResume::::: resume built successfully");

            return htmlContent;
        } catch (error) {
            Log.error("ResumeService::::: buildResume::::: error compiling resume", error);
            throw error;
        }
    }

    async generateResumeFromHtmlAndStoreInS3(htmlContent: string, resumeId: string): Promise<Buffer> {
        Log.info("ResumeService::::: generateResumeFromHtmlAndStoreInS3::::: generating and storing resume");

        // check if resume exists in db
        const resumeData = await this._getResumeDataFromDb(new mongoose.Types.ObjectId(resumeId));
        if (!resumeData) {
            Log.error("ResumeService::::: generateResumeFromHtmlAndStoreInS3::::: no resume found in DB for id:", resumeId);
            throw new Error("Resume not found");
        }

        // build pdf
        const pdfBuffer = await pdfService.generatePdfFromHtml(htmlContent);
        Log.info("ResumeService::::: buildResume::::: PDF generated successfully");

        // store in s3
        // get url withoutkey 
        const { objectKey, publicUrl } = await storageService.uploadObject(pdfBuffer, "application/pdf", "resumes", `resume_${resumeId}`);

        // now update the resume data in db with fileKey and publicUrl
        resumeData.fileKey = objectKey;
        resumeData.publicUrl = publicUrl;
        await resumeModel.getDBModel().updateOne({ _id: new mongoose.Types.ObjectId(resumeId) }, resumeData);
        Log.info("ResumeService::::: generateResumeFromHtmlAndStoreInS3::::: resume data updated in DB successfully");

        return pdfBuffer;
    }
    // #################### private function ###########################
    private async _callLlmForResumeHtml(data: IResume): Promise<string> {
        Log.info("ResumeService::::: _callLlmForResumeHtml::::: preparing LLM payload");

        // Convert the structured object into a formatted JSON string for the LLM to read cleanly
        const serializedResumeData = JSON.stringify(data, null, 2);

        const result = await this.client.chat.complete({
            model: env.MISTRAL_MODEL_NAME, // Points to mistral-small-2603
            messages: [
                {
                    role: 'system',
                    content: utils.appConstant.resumeLlmSystemPrompt
                },
                {
                    role: 'user',
                    content: `Here is my structural data:\n${serializedResumeData}`
                },
            ],
            // Low temperature prevents creative hallucinations or structural tags breakage
            temperature: 0.2
        });

        const htmlOutput = result.choices?.[0]?.message?.content;

        if (!htmlOutput || typeof htmlOutput !== "string") {
            Log.error("ResumeService::::: _callLlmForResumeHtml::::: empty or non-text response from Mistral AI");
            throw new Error("Failed to generate resume text from Mistral AI service.");
        }

        return sanitizeHtml(htmlOutput, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["html", "head", "body", "style", "title"]),
            allowedAttributes: false,
            allowVulnerableTags: false,
        });
    }

    private async _getResumeDataFromDb(resumeId: mongoose.Types.ObjectId): Promise<IResume | null> {
        // Implementation for fetching resume data from the database
        Log.info("ResumeService::::: _getResumeDataFromDb::::: fetching resume data from DB for resumeId:", resumeId);
        const data = await resumeModel.getDBModel().findOne({ _id: resumeId });
        Log.info("ResumeService::::: _getResumeDataFromDb::::: resume data fetched successfully");
        return data as IResume | null;
    }
}

export default new ResumeService();