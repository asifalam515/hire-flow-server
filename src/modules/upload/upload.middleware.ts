import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../../utils/AppError';

// Store files in memory buffer so we can stream them directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only image files (JPEG, PNG, WEBP, GIF) are permitted.', 400));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});
