export declare class CloudinaryService {
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<string[]>;
    deleteImage(publicId: string): Promise<void>;
    extractPublicId(url: string): string;
}
export declare const cloudinaryService: CloudinaryService;
//# sourceMappingURL=cloudinaryService.d.ts.map