import { Request, Response } from 'express';
import * as cartService from '../services/cartService';

const controller = {
    getCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const cart = await cartService.getCartByUserId(userId);
            res.json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to fetch cart' });
        }
    },

    addToCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const { productId, quantity } = req.body;

            if (!userId || !productId) {
                res.status(400).json({ message: 'Missing data' });
                return;
            }

            const cart = await cartService.addToCart(userId, productId, quantity);
            res.status(201).json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to add to cart' });
        }
    },

    updateQuantity: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const { productId, quantity } = req.body;

            if (!userId || !productId || quantity < 1) {
                res.status(400).json({ message: 'Invalid data' });
                return;
            }

            const cart = await cartService.updateItemQuantity(userId, productId, quantity);
            res.json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to update quantity' });
        }
    },

    removeFromCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const { productId } = req.params;

            if (!userId || !productId) {
                res.status(400).json({ message: 'Missing productId' });
                return;
            }


            const cart = await cartService.removeFromCart(userId, productId);
            res.json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to remove item' });
        }
    },

    clearCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const cart = await cartService.clearCart(userId);
            res.json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to clear cart' });
        }
    },
};

export default controller;
