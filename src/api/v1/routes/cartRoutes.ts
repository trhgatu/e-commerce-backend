// src/routes/cartRoutes.ts
import { Router } from 'express';
import cartController from '../controllers/cartController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateQuantity);
router.delete('/remove/:inventoryId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;
