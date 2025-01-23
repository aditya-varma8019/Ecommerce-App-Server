import express from 'express';
import { addItemsToWishlistController, forgotPasswordController, getAllOrdersController, getOrdersController, getWishlistController, loginController, registerController, removeItemFromWishlistController, testController, updateOrderStatusController, updateProfileController } from '../controllers/authController.js';
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

router.post('/wishlist/add', requireSignin, addItemsToWishlistController);

router.get('/wishlist', requireSignin, getWishlistController);

router.post('/wishlist/remove', requireSignin, removeItemFromWishlistController);

export default router;