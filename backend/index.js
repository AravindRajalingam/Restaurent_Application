import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import orderRoutes from './routes/order.routes.js'
import paymentRoutes from './routes/payment.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)

app.listen(5000, () => {
  console.log('User backend running on port 5000')
})
