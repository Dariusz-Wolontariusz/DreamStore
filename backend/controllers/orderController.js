import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'

// @desc Create order
// @route POST /api/orders
// @access Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items.')
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        // set the prduct to object id
        product: x._id,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    // save is MDB method
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private

const getMyOrders = asyncHandler(async (req, res) => {
  // find is a MDB method in this case
  const orders = Order.find({ user: req.user._id })
  res.status(200).json(orders)
})

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private

const getOrderById = asyncHandler(async (req, res) => {
  // populate adds name and email to the order
  const order = Order.findById(req.params.id).populate('name', 'name email')

  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.json('update order to paid')
})

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.json('update order to delivered')
})

// @desc Get all orders
// @route GET /api/orders/
// @access Private/Admin

const getOrders = asyncHandler(async (req, res) => {
  res.json('get all orders')
})

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
}
