import express from 'express';

import controller from '../controllers/roleController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', controller.getAllRoles);

router.get('/:id', controller.getRoleById);

router.post('/create', controller.createRole);

router.put('/update/:id', controller.updateRole);

router.delete('/hard-delete/:id', controller.hardDeleteRole);

router.delete('/delete/:id', controller.softDeleteRole);

router.post('/restore/:id', controller.restoreRole);

router.put('/assign-permissions/:id', controller.assignPermissionsToRole);

export default router;
