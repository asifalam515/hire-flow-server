import { Router } from 'express';
import { uploadImageController, uploadDocumentController } from './upload.controller';
import { uploadMiddleware } from './upload.middleware';

const router = Router();

/**
 * @route   POST /api/v1/upload/image
 * @desc    Upload an image (file or base64) to Cloudinary
 * @access  Public / Optional Auth (used during registration wizard and profile editing)
 */
router.post('/image', uploadMiddleware.single('file'), uploadImageController);

/**
 * @route   POST /api/v1/upload/document
 * @desc    Upload a document (PDF) to Cloudinary
 * @access  Public / Optional Auth
 */
router.post('/document', uploadMiddleware.single('file'), uploadDocumentController);

export const uploadRouter = router;
