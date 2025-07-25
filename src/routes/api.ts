import express from 'express';
import { AuthRoutes } from './auth';

const authRoutes = new AuthRoutes();

const router = express.Router();
router.use(authRoutes.router);


export default router;

