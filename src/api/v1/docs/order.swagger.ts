/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingInfo
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - inventoryId
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     inventoryId:
 *                       type: string
 *                     productId:
 *                       type: string
 *                     colorId:
 *                       type: string
 *                     size:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               shippingInfo:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - phone
 *                   - address
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, momo, vnpay]
 *               voucherCode:
 *                 type: string
 *                 description: Optional voucher code
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Failed to create order
 */

/**
 * @swagger
 * /orders/mine:
 *   get:
 *     summary: Get current user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/status/{id}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Failed to update order status
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/payment/{id}:
 *   put:
 *     summary: Update payment status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [unpaid, paid, refunded]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         description: Failed to update payment status
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/cancel/{id}:
 *   put:
 *     summary: Cancel an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Failed to cancel order
 *       404:
 *         description: Order not found or already cancelled
 */
