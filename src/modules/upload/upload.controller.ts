import { Request, Response } from 'express';
import { uploadImageService, uploadDocumentService } from './upload.service';
import { AppError } from '../../utils/AppError';

/**
 * Controller to handle image file (multipart/form-data) or base64 JSON payload uploads.
 */
export const uploadImageController = async (req: Request, res: Response): Promise<void> => {
  let payload: Buffer | string | undefined;

  if (req.file) {
    payload = req.file.buffer;
  } else if (req.body && req.body.image) {
    payload = req.body.image;
  }

  if (!payload) {
    throw new AppError('No image provided. Send a multipart form file named "file" or JSON with "image" (base64).', 400);
  }

  const folder = typeof req.query.folder === 'string' ? req.query.folder : 'hire-flow/uploads';

  const result = await uploadImageService(payload, folder);

  res.status(201).json({
    success: true,
    data: result,
    message: 'Image successfully uploaded to Cloudinary',
  });
};

export const uploadDocumentController = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new AppError('No document provided. Send a multipart form file named "file".', 400);
  }

  const folder = typeof req.query.folder === 'string' ? req.query.folder : 'hire-flow/resumes';
  const result = await uploadDocumentService(req.file.buffer, folder);

  res.status(201).json({
    success: true,
    data: result,
    message: 'Document successfully uploaded to Cloudinary',
  });
};
