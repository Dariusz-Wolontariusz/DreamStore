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
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// previous routes made to functions in controllers

router.route('/').get(protect, admin, getUsers).post(registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)

export default router
