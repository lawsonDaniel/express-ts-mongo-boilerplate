import express from 'express';
import authClass from '../controller/auth/auth.class';
import adminClass from '../controller/admin.class';
import isAuthenticated from '../middleware/authorization';

const router = express.Router();
//auth routes
router.post('/auth/login',authClass.login)
router.post('/auth/register',authClass.register)
router.post('/auth/forget-password',authClass.register)
router.get('/auth/user',isAuthenticated,authClass.getAuthUser)
//dashboard routes
router.get('/dashboard',isAuthenticated,adminClass.getDashboardDetails)
router.get('/products',isAuthenticated,adminClass.getProducts)
router.patch('/products',isAuthenticated,adminClass.acceptDeclineProduct)
//user routes
router.get('/user',isAuthenticated,adminClass.getAllUsers)
//banner images
router.post('/bannerImages',isAuthenticated,adminClass.uploadBannerImage)
router.get('/bannerImages',adminClass.bannerImage)
export default router;

