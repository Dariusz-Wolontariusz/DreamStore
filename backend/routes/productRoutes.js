import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from '../controllers/productController.js'

const router = express.Router()

// previous routes made to functions in controllers

router.route('/').get(getProducts).post(protect, admin, createProduct)

router.route('/:id').get(getProductById).put(protect, admin, updateProduct)

export default router
