import User from '../models/userModel.js'
import asyncHandler from '../middleware/asyncHandler.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })

  // password validation function is in userModel.js

  if (user && (await user.matchPassword(password))) {
    // generates token and saves it to httpOnly cookie

    generateToken(res, user._id)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // token: generateToken(user._id), //token stored in a local storage - bad for safety / changed to httpOnly
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc Register a new user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists.')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    // generates token and saves it to httpOnly cookie

    generateToken(res, user._id)

    res.send(201).json({
      _id: user._id,
      name: user.name,
      password: user.password,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data.')
  }
})

// @desc logout user / clear cookie
// @route POST /api/users/logout
// @access Private

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies

  res.cookie('jwt', '', {
    httpOnly: true,
    sameSite: 'None',
    secure: true, // enforce secure transmission
    expires: new Date(0),
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

// @desc GET user profile
// @route GET /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// @desc update user profile
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {
  // const { name, email, password } = req.user

  const user = await User.findById(req.user._id)

  if (user) {
    {
      user.name = req.user.name || user.name
      user.email = req.user.email || user.email

      if (req.user.password) {
        user.password = req.body.password
      }
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updateUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      admin: updateUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// @desc Get all the users
// @route GET /api/users
// @access Private/Admin

const getUsers = asyncHandler(async (req, res) => {
  res.send('get users')
})

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin

const getUserById = asyncHandler(async (req, res) => {
  res.send('get user by ID')
})

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  res.send('delete user')
})

// @desc Update any user
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {
  res.send('update user')
})

export {
  authUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  logoutUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
}
