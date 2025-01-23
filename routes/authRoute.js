import express from 'express';
import { forgotPasswordController, getAllOrdersController, getOrdersController, loginController, registerController, testController, updateOrderStatusController, updateProfileController } from '../controllers/authController.js';
import { adminSignIn, requireSignin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);

router.get('/test', requireSignin, adminSignIn, testController);

// forgot password
router.post('/forgot-password', forgotPasswordController);

//protected user route auth
router.get('/user-auth', requireSignin, (req, res) => {
    res.status(200).send({ ok: true })
})

// admin protected route
router.get('/admin-auth', requireSignin, adminSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

// update profile
router.put('/profile', requireSignin, updateProfileController);

// orders
router.get('/orders', requireSignin, getOrdersController);

// all orders
router.get('/all-orders', requireSignin, adminSignIn, getAllOrdersController);

// order status update

router.put('/order-status/:orderId', requireSignin, adminSignIn, updateOrderStatusController);

export default router;