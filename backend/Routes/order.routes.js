import express from 'express'
import { placeOrder, myOrders, orderStatus } from '../controllers/order.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', protect, placeOrder)
router.get('/my', protect, myOrders)
router.get('/:orderId/status', protect, orderStatus)

export default router
