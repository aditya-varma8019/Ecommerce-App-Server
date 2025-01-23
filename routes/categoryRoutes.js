import express from 'express';
import { createCategoryController, deleteCategoryController, getAllCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';
import { adminSignIn, requireSignin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// routes

// create category
router.post('/create-category', requireSignin, adminSignIn, createCategoryController);

// update category
router.put('/update-category/:id', requireSignin, adminSignIn, updateCategoryController);

// get all categories
router.get('/get-category', getAllCategoryController);

// get one category
router.get('/single-category/:slug', singleCategoryController);

// delete category
router.delete('/delete-category/:id', requireSignin, adminSignIn, deleteCategoryController);

export default router;