import express from 'express'
import { signup, signin } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)     
// router.get('/profile', protect, profile)

export default router
