import express from 'express';

const router = express.Router();

/**
 * @openapi
 * /example:
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
router.get('/example', (req: express.Request, res: express.Response) => {
  res.json({ message: 'This is an example route!' });
});

export default router;
