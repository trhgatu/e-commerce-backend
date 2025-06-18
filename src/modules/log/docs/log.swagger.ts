/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: API for managing system logs
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get all logs
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default = 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default = 10)
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: Optional filters (e.g., action, model)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting option
 *     responses:
 *       200:
 *         description: List of logs
 *       400:
 *         description: Failed to fetch logs
 */

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Get a log by ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the log
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log details
 *       404:
 *         description: Log not found
 */

/**
 * @swagger
 * /logs/delete/{id}:
 *   delete:
 *     summary: Hard delete a log by ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the log to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log deleted successfully
 *       404:
 *         description: Log not found
 */

/**
 * @swagger
 * /logs/clear-log:
 *   delete:
 *     summary: Clear all logs (dev only)
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: All logs cleared
 *       400:
 *         description: Failed to clear logs
 */
