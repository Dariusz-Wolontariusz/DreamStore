import express from 'express'
import { authUser } from '../controllers/usersController.js'
const router = express.Router()

// previous routes made to functions in controllers

router.post('/login', authUser)

export default router
