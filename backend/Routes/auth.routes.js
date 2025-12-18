import express from 'express'
import { signup, signin,getMe } from '../Controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)     
router.get('/me', protect, getMe);

export default router
