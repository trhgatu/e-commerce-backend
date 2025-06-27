import express from 'express';
import { uploadProductImage } from './upload-image.controller';
import { uploadMiddleware } from '@middlewares';

const router = express.Router();

router.post(
  '/upload-image',
  uploadMiddleware.single('image'),
  uploadProductImage
);

export default router;
