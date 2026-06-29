import { Request, Response } from "express";
import resumeService from "@/services/resume.service";
import { Log } from "@/utils/logger";
import utils from "@/utils";
import { IResumeResponse } from "@/interface/response/resume.response";
import { IResumeRequest } from "@/interface/request/resume.request";


class ResumeController {
    async generateResume(req: Request, res: Response) {
        Log.info("ResumeController:::generateResume:::: generating resume");
        const { resumeId } = req.params;
        Log.info("ResumeController:::generateResume:::: resumeId:", resumeId);
        const resumeHtml = await resumeService.buildResume({ resumeId });

        // res.set({
        //     "Content-Type": "application/pdf",
        //     "Content-Disposition": 'attachment; filename="resume.pdf"',
        //     "Content-Length": pdfBuffer.length,
        // });
        res.status(utils.http.HttpStatusCodes.OK).send(resumeHtml);
    }

    async generateAndStoreResume(req: Request, res: Response) {
        Log.info("ResumeController:::generateAndStoreResume:::: generating and storing resume");
        const htmlData: string = req.body
        const { resumeId } = req.params;
        Log.info("ResumeController:::generateAndStoreResume:::: resumeId:", resumeId);
        Log.info("ResumeController:::generateAndStoreResume:::: htmlData length:", htmlData);
        const pdfBuffer = await resumeService.generateResumeFromHtmlAndStoreInS3(htmlData, resumeId);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="resume.pdf"',
            "Content-Length": pdfBuffer.length,
        });
        res.status(utils.http.HttpStatusCodes.OK).send(pdfBuffer);

    }
}

export default new ResumeController();