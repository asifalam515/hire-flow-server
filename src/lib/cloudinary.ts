import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../config/env';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Check if real Cloudinary keys are configured or if we're in dev simulation.
 */
export const isCloudinaryConfigured = (): boolean => {
  return (
    env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud_name' &&
    env.CLOUDINARY_API_KEY !== '123456789012345' &&
    Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)
  );
};

/**
 * Uploads an image buffer or base64 data URI to Cloudinary.
 * If Cloudinary is not configured with real API keys during development,
 * returns a simulated Cloudinary URL and logs for local development.
 */
export const uploadToCloudinary = async (
  input: Buffer | string,
  folder: string = 'hire-flow/logos',
): Promise<{ url: string; publicId: string; width: number; height: number; format: string }> => {
  if (!isCloudinaryConfigured() && env.NODE_ENV === 'development') {
    // Development Simulation Mode
    console.warn('\n⚠️  [Cloudinary Dev Simulation Mode] Upload requested.');
    console.warn(`📁 Target Folder: ${folder}`);

    // If input is base64 data URI, we can return it as simulated URL or return a realistic Cloudinary URL
    const simulatedUrl =
      typeof input === 'string' && input.startsWith('data:image/')
        ? input
        : 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=256&auto=format&fit=crop';

    const simulatedPublicId = `${folder}/dev_${Date.now()}`;

    console.warn(`✅ Simulated Upload URL: ${simulatedUrl.substring(0, 80)}...\n`);

    return {
      url: simulatedUrl,
      publicId: simulatedPublicId,
      width: 400,
      height: 400,
      format: 'png',
    };
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // limit dimensions for storage optimization
        { quality: 'auto', fetch_format: 'auto' }, // Cloudinary AI auto format/quality
      ],
    };

    if (Buffer.isBuffer(input)) {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary stream upload returned empty result'));
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      });
      uploadStream.end(input);
    } else {
      // Direct base64 / data URI string upload
      cloudinary.uploader.upload(input, uploadOptions, (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary direct upload returned empty result'));
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      });
    }
  });
};

/**
 * Delete an image asset from Cloudinary by its public ID.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  if (!isCloudinaryConfigured()) return true;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error(`❌ Failed to delete Cloudinary asset [${publicId}]:`, error);
    return false;
  }
};
