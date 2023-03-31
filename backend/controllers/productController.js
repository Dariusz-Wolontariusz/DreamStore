import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

// step 1. all routes copied from server.js with cleared /api/products
// step 2. controllers made out of routes from productRoutes

// @desc Fetch product
// @route GET /api/products
// @access Public

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

// @desc Fetch all products
// @route GET /api/products/:id
// @access Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

export { getProducts, getProductById }
