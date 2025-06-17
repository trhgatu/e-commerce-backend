import { Request, Response } from 'express';
import * as cartService from '../services/cartService';
import { AddToCartInput, RemoveFromCartInput, UpdateCartItemInput } from '../types/cart/cartDTO';

const controller = {
    /**
     * GET /api/v1/cart
     */
    getCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
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

    /**
     * POST /api/v1/cart
     * Body: AddToCartInput
     */
    addToCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            const payload: AddToCartInput = req.body;

            if (!userId || !payload?.inventoryId || !payload?.productId || !payload.quantity) {
                res.status(400).json({ message: 'Missing required cart data' });
                return;
            }

            const cart = await cartService.addToCart(userId, payload);
            res.status(201).json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to add to cart' });
        }
    },

    /**
     * PATCH /api/v1/cart
     * Body: UpdateCartItemInput
     */
    updateQuantity: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            const payload: UpdateCartItemInput = req.body;

            if (!userId || !payload?.inventoryId || payload.quantity < 1) {
                res.status(400).json({ message: 'Invalid update data' });
                return;
            }

            const cart = await cartService.updateItemQuantity(userId, payload);
            res.json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to update quantity' });
        }
    },

    /**
     * DELETE /api/v1/cart/:inventoryId
     */
    removeFromCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            const inventoryId = req.params.inventoryId;

            if (!userId || !inventoryId) {
                res.status(400).json({ message: 'Missing inventoryId' });
                return;
            }

            const payload: RemoveFromCartInput = { inventoryId };
            const cart = await cartService.removeFromCart(userId, payload);
            res.json({ success: true, data: cart });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to remove item' });
        }
    },

    /**
     * DELETE /api/v1/cart
     */
    clearCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
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
