import express from 'express';
import authClass from '../controller/auth/auth.class';
import adminClass from '../controller/admin.class';

const router = express.Router();
//auth routes
router.post('/auth/login',authClass.login)
router.post('/auth/register',authClass.register)
router.post('/auth/forget-password',authClass.register)
router.get('/auth/user',authClass.getAuthUser)
//dashboard routes
router.get('/dashboard',adminClass.getDashboardDetails)
router.get('/products',adminClass.getProducts)

export default router;
