import express from 'express';

import controller from './role.controller';
import { createLog, protect } from '@middlewares';
import { LogAction } from '@common/models';

const router = express.Router();

router.get('/', controller.getAllRoles);

router.get('/:id', controller.getRoleById);

router.post('/create',
    protect,
    createLog(LogAction.CREATE, 'Role'),
    controller.createRole
);

router.put(
    '/update/:id',
    protect,
    createLog(LogAction.UPDATE, 'Role'),
    controller.updateRole
);

router.delete('/hard-delete/:id', controller.hardDeleteRole);

router.delete(
    '/delete/:id',
    protect,
    createLog(LogAction.DELETE, 'Role'),
    controller.softDeleteRole
);

router.post('/restore/:id',
    protect,
    createLog(LogAction.DELETE, 'Role'),
    controller.restoreRole,
);

router.put(
    '/assign-permissions/:id',
    protect,
    createLog(LogAction.ASSIGN_PERMISSION, 'Role'),
    controller.assignPermissionsToRole
);

export default router;
