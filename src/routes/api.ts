import express from 'express';
import authClass from '../controller/auth/auth.class';

const router = express.Router();

/**
 * @openapi
 * /examples:
 *   get:
 *     description: Returns a message from the example route
 *     responses:
 *       200:
 *         description: A message from the example route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'This is an example route!'
 */
router.get('/examples', (req: express.Request, res: express.Response) => {
  res.json({ message: 'This is an example route!' });
});

//auth routes
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     description: Returns a message from the example 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password123!
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: A message from the example route
 *         
 */
router.post('/auth/login',authClass.login)
/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     description: Returns a message from the example route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password123!
 *             required:
 *               - email
 *               - password
 *    
 *         
 */
router.post('/auth/register',authClass.register)
/**
 * @openapi
 * /api/v1/auth/forget-password:
 *   post:
 *     description: Returns a message from the example route
 *     responses:
 *       200:
 *         description: A message from the example route
 *         
 */
router.post('/auth/forget-password',authClass.register)
/**
 * @openapi
 * /api/v1/auth/user:
 *   get:
 *     description: Returns a message from the example route
 *     responses:
 *       200:
 *         description: A message from the example route
 *         
 */
router.get('/auth/user',authClass.getAuthUser)

export default router;
