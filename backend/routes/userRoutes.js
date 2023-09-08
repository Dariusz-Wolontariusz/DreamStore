import express from 'express'
import {
  authUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  logoutUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

// previous routes made to functions in controllers

router.route('/').get(getUsers).post(registerUser)
router.post('/login', authUser)
router.post('/logout', logoutUser)
router.route('/profile').get(getUserProfile).put(updateUserProfile)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

export default router
