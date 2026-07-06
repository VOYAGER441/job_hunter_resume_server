export interface ISignedUploadUrl {
    signedUrl: string;
    objectKey: string;
    publicUrl: string;
}

export interface ISignedDownloadUrl {
    signedUrl: string;
    expiresIn: number;
}