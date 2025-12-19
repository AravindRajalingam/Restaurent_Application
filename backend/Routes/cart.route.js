import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { addToCart, decreaseCartItem, getCart, increaseCartItem, removeFromCart } from '../Controllers/cart.controller.js'

const router = express.Router()
router.get('/get-cart', protect, getCart)
router.post('/add-to-cart', protect, addToCart)
router.delete('/remove-from-cart/:id', protect, removeFromCart)
router.put('/increase/:id', protect, increaseCartItem)
router.put('/decrease/:id', protect, decreaseCartItem)

export default router
