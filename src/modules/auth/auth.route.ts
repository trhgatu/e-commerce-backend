import express from 'express';
import controller from './auth.controller';
import { createLog } from '@middlewares/log.middleware';
import { LogAction } from '@common/models';
import { protect } from '@middlewares/auth.middleware';

const router = express.Router();

router.post(
    '/register',
    createLog(LogAction.REGISTER, 'Auth'),
    controller.register
);

router.post(
    '/login',
    createLog(LogAction.LOGIN, 'Auth'),
    controller.login
);

router.post('/refresh-token', controller.refreshToken);
router.get('/me', protect, controller.getMe);
router.post('/logout', controller.logout);

export default router;
