import { Request, Response } from 'express';
import * as notificationService from './notification.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
    getAllNotifications: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { filters, sort } = buildCommonQuery(req, ['title', 'content']);

            const result = await notificationService.getAllNotifications(
                req.user._id,
                page,
                limit,
                filters,
                sort
            );

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Notifications fetched successfully',
                data: result.data,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                totalItems: result.total,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch notifications', 400);
        }
    },

    markAsRead: async (req: Request, res: Response) => {
        try {
            const notif = await notificationService.markNotificationAsRead(
                req.params.id
            );
            if (!notif) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Notification not found',
                });
                return;
            }

            res.locals.targetId = notif._id?.toString();
            res.locals.description = `Marked notification as read: ${notif.title}`;

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Notification marked as read',
                data: notif,
            });
        } catch (error) {
            handleError(res, error, 'Failed to mark notification as read', 400);
        }
    },

    markAllAsRead: async (req: Request, res: Response) => {
        try {
            const result = await notificationService.markAllAsRead(req.user._id);

            res.locals.description = `Marked all notifications as read for user ${req.user._id}`;

            res.status(200).json({
                success: true,
                code: 200,
                message: 'All notifications marked as read',
                modifiedCount: result.modifiedCount,
            });
        } catch (error) {
            handleError(res, error, 'Failed to mark all notifications', 400);
        }
    },

    createNotification: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User ID is missing from request');
            const notif = await notificationService.createNotification(req.body, userId);

            res.locals.targetId = notif._id?.toString();
            res.locals.description = `Created notification: ${notif.title}`;

            res.status(201).json({
                success: true,
                code: 201,
                message: 'Notification created',
                data: notif,
            });
        } catch (error) {
            handleError(res, error, 'Failed to create notification', 400);
        }
    },
};

export default controller;
