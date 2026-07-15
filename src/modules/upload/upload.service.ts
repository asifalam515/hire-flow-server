import { uploadToCloudinary } from '../../lib/cloudinary';
import { AppError } from '../../utils/AppError';

export interface ImageUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Service to process an image upload buffer or base64 string and push to Cloudinary.
 */
export const uploadImageService = async (
  fileOrBase64: Buffer | string,
  folder: string = 'hire-flow/uploads',
): Promise<ImageUploadResult> => {
  if (!fileOrBase64) {
    throw new AppError('No image payload or file buffer provided for upload', 400);
  }

  try {
    const result = await uploadToCloudinary(fileOrBase64, folder);
    return result;
  } catch (error: any) {
    throw new AppError(error.message || 'Cloudinary image upload failed', 502);
  }
};
