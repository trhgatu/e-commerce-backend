import express from 'express';

import controller from '../controllers/permissionController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', controller.getAllPermissions);

router.get('/:id', controller.getPermissionById);

router.post('/create', controller.createPermission);

router.put('/update/:id', controller.updatePermission);

router.delete('/hard-delete/:id', controller.hardDeletePermission);

router.delete('/delete/:id', controller.softDeletePermission);

router.post('/restore/:id', controller.restorePermission);

router.post('/bulk-create', controller.bulkCreatePermissions);

export default router;
