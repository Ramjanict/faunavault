import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, folder = 'animals'): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(new BadRequestException(`Cloudinary upload failed: ${error.message}`));
          if (!result) return reject(new BadRequestException('Cloudinary upload returned empty result'));
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async uploadBase64OrUrl(dataUriOrUrl: string, folder = 'animals'): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(dataUriOrUrl, {
        folder,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      return result;
    } catch (error: any) {
      throw new BadRequestException(`Cloudinary upload failed: ${error?.message || error}`);
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    if (!publicId) return;
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
    }
  }
}
