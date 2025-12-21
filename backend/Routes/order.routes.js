import express from 'express'
import { fetchAllOrders, myOrders, orderStatus, updateStatus } from '../Controllers/order.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/my-orders',protect, myOrders)
router.get('/:orderId/status', protect, orderStatus)

router.get('/fetch-all-orders', fetchAllOrders)
router.patch('/update-order-status',updateStatus)

export default router
