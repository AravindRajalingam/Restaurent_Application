import express from 'express'
import cors from 'cors'

import authRoutes from './Routes/auth.routes.js'
import menuRoutes from './Routes/menu.routes.js'
import orderRoutes from './Routes/order.routes.js'
import paymentRoutes from './Routes/payment.routes.js'

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
