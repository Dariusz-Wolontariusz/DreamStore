import Product from '../models/productModel.js'
import asyncHandler from '../middleware/asyncHandler.js'

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
    res.status(404)
    throw new Error('Resource not found.')
  }
})

// @desc Create product
// @route POST /api/products
// @access Private / Admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'sample category',
    countInStock: 0,
    description: 'Sample description',
    numReviews: 0,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

export { getProducts, getProductById, createProduct }
