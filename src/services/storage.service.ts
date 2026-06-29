import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file"; // Fixed submodule import
import { Log } from "@/utils/logger";
import { ISignedDownloadUrl, ISignedUploadUrl } from "@/interface/response/file.response";
import env from "@/environment";
import crypto from "crypto";

class AppwriteStorageService {
    private client: Client;
    private storage: Storage;
    private bucketId: string;

    constructor() {
        this.bucketId = env.APPWRITE_BUCKET_ID;

        this.client = new Client()
            .setEndpoint(env.APPWRITE_ENDPOINT)     
            .setProject(env.APPWRITE_PROJECT_ID)    
            .setKey(env.APPWRITE_API_KEY);          

        this.storage = new Storage(this.client);
    }

    /**
     * Direct server-side upload.
     * Converts a Buffer into an Appwrite InputFile.
     */
    async uploadObject(
        buffer: Buffer,
        contentType: string,
        folder = "resumes", // Note: Appwrite uses file IDs, folder names can be prepended to the ID or handled via permissions.
        fileName:string
    ): Promise<ISignedUploadUrl> {
        const ext = contentType.split("/")[1] ?? "bin";
        // Appwrite file IDs must be alphanumeric or use ID.unique(). 
        // We combine the folder prefix with a unique string.
        const customFileId = `${folder}_${Date.now()}_${crypto.randomUUID().replace(/-/g, "")}`.substring(0, 36);

        const fileInput = InputFile.fromBuffer(buffer, `${fileName}.${ext}`);

        const file = await this.storage.createFile(
            this.bucketId,
            customFileId,
            fileInput
        );

        // Appwrite doesn't natively use signed upload URLs for backend uploads.
        // We return the direct view/download URL as the public target.
        const publicUrl = `${env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${file.$id}/view?project=${env.APPWRITE_PROJECT_ID}`;

        Log.info(`AppwriteStorageService::::uploadObject::: fileId=${file.$id}`);
        return { signedUrl: publicUrl, objectKey: file.$id, publicUrl };
    }

    /**
     * Appwrite handles client-side direct uploads through its Frontend SDKs, 
     * not via pre-generated PUT URLs. For backend compatibility, this generates a landing ID.
     */
    async getSignedUploadUrlWithoutKey(
        contentType: string,
        folder = "resumes",
        expiresIn = 3600
    ): Promise<ISignedUploadUrl> {
        const customFileId = `${folder}_${Date.now()}_${crypto.randomUUID().replace(/-/g, "")}`.substring(0, 36);

        // In Appwrite, you typically upload directly using the client SDK. 
        // We provide the endpoint format expected for frontend execution.
        const uploadUrl = `${env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files`;
        const publicUrl = `${uploadUrl}/${customFileId}/view?project=${env.APPWRITE_PROJECT_ID}`;

        Log.info(`AppwriteStorageService::::getSignedUploadUrlWithoutKey::: generated fileId=${customFileId}`);
        return { signedUrl: uploadUrl, objectKey: customFileId, publicUrl };
    }

    /**
     * Mocked for interface matching. Standard Appwrite architecture utilizes 
     * JWT client tokens rather than client-supplied single keys.
     */
    async getSignedUploadUrlWithKey(
        objectKey: string,
        contentType: string,
        expiresIn = 3600
    ): Promise<ISignedUploadUrl> {
        const uploadUrl = `${env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files`;
        const publicUrl = `${uploadUrl}/${objectKey}/view?project=${env.APPWRITE_PROJECT_ID}`;

        Log.info(`AppwriteStorageService::::getSignedUploadUrlWithKey::: fileId=${objectKey}`);
        return { signedUrl: uploadUrl, objectKey, publicUrl };
    }

    /**
     * Time-limited download for private buckets.
     * Leverages Appwrite's File Security layers.
     */
    async getSignedDownloadUrl(
        objectKey: string,
        expiresIn = 3600
    ): Promise<ISignedDownloadUrl> {
        // Generates a JWT-backed token URL valid for file downloading
        const downloadUrl = this.storage.getFileDownload(this.bucketId, objectKey).toString();

        Log.info(`AppwriteStorageService::::getSignedDownloadUrl::: fileId=${objectKey}`);
        return { signedUrl: downloadUrl, expiresIn };
    }

    /**
     * Delete a file by its unique ID.
     */
    async deleteObject(objectKey: string): Promise<void> {
        await this.storage.deleteFile(this.bucketId, objectKey);
        Log.info(`AppwriteStorageService::::deleteFile::: fileId=${objectKey}`);
    }

    /**
     * Check if an object exists using metadata lookup.
     */
    async objectExists(objectKey: string): Promise<boolean> {
        try {
            await this.storage.getFile(this.bucketId, objectKey);
            return true;
        } catch {
            return false;
        }
    }
}

export default new AppwriteStorageService();