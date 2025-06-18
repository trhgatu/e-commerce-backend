import express from 'express';
import controller from './inventory.controller';
import { validate } from '@middlewares';
import {
    createInventorySchema,
    updateInventorySchema
} from './inventory.validator';

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
