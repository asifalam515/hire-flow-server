import { Router } from 'express';
import { uploadImageController } from './upload.controller';
import { uploadMiddleware } from './upload.middleware';

const router = Router();

/**
 * @route   POST /api/v1/upload/image
 * @desc    Upload an image (file or base64) to Cloudinary
 * @access  Public / Optional Auth (used during registration wizard and profile editing)
 */
router.post('/image', uploadMiddleware.single('file'), uploadImageController);

export const uploadRouter = router;
