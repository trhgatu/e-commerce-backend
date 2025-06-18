import { Request, Response } from 'express';
import { uploadImageToSupabase } from './upload-image.service';
import { handleError } from '@common/utils';

export const uploadProductImage = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        console.log('File:', file);
        if (!file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return
        }

        const url = await uploadImageToSupabase(file.buffer, file.mimetype);
        res.status(200).json({ success: true, url });
    } catch (err) {
        handleError(res, err, 'Upload image failed');
    }
};
