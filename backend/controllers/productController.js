import Product from '../models/productModel.js'
import asyncHandler from '../middleware/asyncHandler.js'

// step 1. all routes copied from server.js with cleared /api/products
// step 2. controllers made out of routes from productRoutes

// @desc Fetch all products
// @route GET /api/products
// @access Public

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

// @desc Fetch a product
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

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description

    const updatedProduct = await product.save()

    res.status(200).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found.')
  }
})

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.status(200).json('Product deleted')
  } else {
    res.status(404)
    throw new Error('Product not found.')
  }
})

// @desc Review a product
// @route POST /api/products/:id/reviews
// @access Private

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = await product.reviews.find(
      (review) => product.user.toString() === req.body._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already has a review.')
    }

    const review = {
      user: req.body._id,
      name: req.body.name,
      rating: Number(),
      comment,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating) /
      product.reviews.length

    await product.save()
    res.status(200).json('Review added.')
  } else {
    res.status(404)
    throw new Error('Resource not found.')
  }
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
}
