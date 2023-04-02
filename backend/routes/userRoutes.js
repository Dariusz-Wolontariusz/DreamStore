import express from 'express'
import {
  authUser,
  getUserProfile,
  registerUser,
} from '../controllers/usersController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

// previous routes made to functions in controllers

router.route('/').post(registerUser)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile)

export default router
