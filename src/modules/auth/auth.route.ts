import express from 'express';
import controller from './auth.controller';
import { createLog } from '@middlewares/log.middleware';
import { LogAction } from '@common/models';

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

export default router;
