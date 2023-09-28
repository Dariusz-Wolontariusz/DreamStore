import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from '../middleware/asyncHandler.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  //read JWT from cookie

  token = req.cookies.jwt

  if (token) {
    //version where JWT was in a local storage
    // req.headers.authorization && req.headers.authorization.startsWith('Bearer')

    try {
      //version where JWT was in a local storage
      // token = req.headers.authorization.split(' ')[1]

      //jwt
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.userId).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed.')
    }
  } else {
    res.status(401)
    throw new Error('Not authorized, no token found.')
  }
})

//Admin middleware

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  }
  res.status(401)
  throw new Error('Not authorized as admin.')
}

export { protect, admin }
