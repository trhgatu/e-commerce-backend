import express from 'express';
import { uploadProductImage } from '../controllers/imageController';
import { uploadMiddleware } from '../middlewares/multerMiddleware';

const router = express.Router();

router.post('/upload-image', uploadMiddleware.single('image'), uploadProductImage);

export default router;
