import express from 'express'
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js'
const router = express.Router()

// previous routes made to functions in controllers

router.route('/').get(getProducts)

router.route('/:id').get(getProductById)

export default router
