import express from 'express';
import controller from '../controllers/categoryController';
import { validate } from '../middlewares/validateMiddleware';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         parentId:
 *           type: string
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *     CategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         parentId:
 *           type: string
 *           nullable: true
 *       required:
 *         - name
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get paginated list of categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful fetch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

router.get('/', controller.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */

router.get('/:id', controller.getCategoryById);

router.get('/category-tree', controller.getCategoryTree)

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 */

router.post('/create', validate(createCategorySchema), controller.createCategory);

/**
 * @swagger
 * /categories/update/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */

router.put('/update/:id', validate(updateCategorySchema), controller.updateCategory);

/**
 * @swagger
 * /categories/hard-delete/{id}:
 *   delete:
 *     summary: Hard delete a category
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */

router.delete('/hard-delete/:id', controller.hardDeleteCategory);

/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Soft delete a category
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Soft deleted successfully
 *       404:
 *         description: Not found
 */

router.delete('/delete/:id', controller.softDeleteCategory)

export default router;