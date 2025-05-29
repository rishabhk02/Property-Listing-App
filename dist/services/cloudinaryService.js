"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const environment_1 = require("../config/environment");
cloudinary_1.v2.config({
    cloud_name: environment_1.config.cloudinary.cloudName,
    api_key: environment_1.config.cloudinary.apiKey,
    api_secret: environment_1.config.cloudinary.apiSecret
});
class CloudinaryService {
    async uploadImage(file, folder = 'Hypergro' // default folder
    ) {
        try {
            // Upload image from memory
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                }).end(file.buffer);
            });
            return result.secure_url;
        }
        catch (error) {
            throw new Error('Failed to upload image');
        }
    }
    async uploadMultipleImages(files, folder = 'properties') {
        try {
            const uploadPromises = files.map(file => this.uploadImage(file, folder));
            const urls = await Promise.all(uploadPromises);
            return urls;
        }
        catch (error) {
            throw new Error('Failed to upload images.');
        }
    }
    async deleteImage(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            throw new Error('Failed to delete image.');
        }
    }
    extractPublicId(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const folderAndFile = parts[parts.length - 2] + '/' + filename;
        return folderAndFile.split('.')[0];
    }
}
exports.CloudinaryService = CloudinaryService;
exports.cloudinaryService = new CloudinaryService();
//# sourceMappingURL=cloudinaryService.js.map