import express from 'express';
import authClass from '../controller/auth/auth.class';
import adminClass from '../controller/admin.class';
import isAuthenticated from '../middleware/authorization';
import userClass from '../controller/user.class';

const router = express.Router();
//auth routes
router.post('/auth/login',authClass.login)
router.post('/auth/register',authClass.register)
router.post('/auth/forget-password',authClass.register)
router.get('/auth/user',isAuthenticated,authClass.getAuthUser)
router.patch('/auth/user',isAuthenticated,authClass.update)
//dashboard routes admin
router.get('/dashboard',isAuthenticated,adminClass.getDashboardDetails)
router.get('/products',isAuthenticated,adminClass.getProducts)
router.patch('/products',isAuthenticated,adminClass.acceptDeclineProduct)
//user routes
router.get('/user',isAuthenticated,adminClass.getAllUsers)
//dashboard details user
router.get('/promoDetails',isAuthenticated,userClass.getProduct)
router.get('/promoDetailsCount',isAuthenticated,userClass.getProductCount)
router.get('/promoAdminDetailsCount',isAuthenticated,userClass.getAdminProductCount)
router.post('/promo',isAuthenticated,userClass.uploadPromo)
router.patch('/promoTemp',userClass.updateTemprature)
//public routes
router.get('/promo',userClass.getPromo)


//banner images
router.post('/bannerImages',isAuthenticated,adminClass.uploadBannerImage)
router.get('/bannerImages',adminClass.bannerImage)



export default router;

