import express from 'express'
import { cashOnDelivery, createPaymentOrder, updateFailed, verifyPayment } from '../Controllers/payment.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/create-order', protect, createPaymentOrder)
router.post('/verify-payment', protect, verifyPayment)
router.post('/cod', protect, cashOnDelivery)
router.put('/update-failed',protect,updateFailed)

export default router
