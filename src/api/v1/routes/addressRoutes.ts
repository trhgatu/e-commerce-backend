import express from 'express';
import controller from '../controllers/addressController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', controller.getMyAddresses);

router.post('/create', controller.createAddress);

router.get('/:id', controller.getAddressById)

router.put('/update/:id', controller.updateAddress);

router.delete('/delete/:id', controller.deleteAddress);

router.post('/set-default', controller.setDefaultAddress);

export default router;
