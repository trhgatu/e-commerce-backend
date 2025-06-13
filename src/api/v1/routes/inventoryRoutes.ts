import express from 'express';
import controller from '../controllers/inventoryController';
import { validate } from '../middlewares/validateMiddleware';
import { createInventorySchema, updateInventorySchema } from '../validators/inventoryValidator';

const router = express.Router();

router.get('/by-product/:productId', controller.getInventoriesByProductId);

router.get('/summary/:productId', controller.getInventorySummary);

router.patch('/increase/:id', controller.increaseQuantity);

router.patch('/decrease/:id', controller.decreaseQuantity);

router.get('/', controller.getAllInventories);

router.get('/:id', controller.getInventoryById);

router.post('/create', validate(createInventorySchema), controller.createInventory);

router.put('/update/:id', validate(updateInventorySchema), controller.updateInventory);

router.delete('/delete/:id', controller.deleteInventory);

export default router;
