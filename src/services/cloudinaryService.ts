import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/environment';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'Hypergro' // default folder
  ): Promise<string> {
    try {
      // Upload image from memory
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      return (result as any).secure_url;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'properties'
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, folder));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      throw new Error('Failed to upload images.');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error('Failed to delete image.');
    }
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const folderAndFile = parts[parts.length - 2] + '/' + filename;
    return folderAndFile.split('.')[0];
  }
}

export const cloudinaryService = new CloudinaryService();