import express from 'express';
import { requireSignin, adminSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getProductCountController, getSingleProductController, getSingleProductPhotoController, productCategoryController, productFilterController, productListController, searchProductController, similarProductsController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';


const router = express.Router();

//routes
// create product
router.post('/create-product', requireSignin, adminSignIn, formidable(), createProductController);

// get products
router.get('/get-product', getProductController)

// single product
router.get('/get-product/:slug', getSingleProductController)

// get photo
router.get('/product-photo/:pid', getSingleProductPhotoController)

// delete product
router.delete('/delete-product/:pid', requireSignin, adminSignIn, deleteProductController);

// update product
router.put('/update-product/:pid', requireSignin, adminSignIn, formidable(), updateProductController);

// filter product
router.post('/product-filters', productFilterController)

// product count
router.get('/product-count', getProductCountController)

//product per page
router.get('/product-list/:page', productListController)

// search product
router.get('/search/:keyword', searchProductController);

// similar products
router.get('/similar-products/:pid/:cid', similarProductsController);

// category wise products
router.get('/product-category/:slug', productCategoryController);

// payment route
//token
router.get('/braintree/token', braintreeTokenController);

// payments
router.post('/braintree/payment', requireSignin, braintreePaymentController);

export default router;