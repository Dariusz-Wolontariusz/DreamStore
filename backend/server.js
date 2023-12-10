import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import connectDB from './config/db.js'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'

connectDB()

const app = express()

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cookie parser middleware
app.use(cookieParser())

// moved down before deplopyment
// app.get('/', (req, res) => {
//   res.send('API is running...')
// })

//mounting all the routes

app.use('/api/products', productRoutes)

app.use('/api/users', userRoutes)

app.use('/api/orders', orderRoutes)

// paypall route

app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
})

// custom error handler

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve()
  // set static folder
  app.use('/uploads', express.static('/var/data/uploads'))
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  // any non API route will be redirected here
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  const __dirname = path.resolve()
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// error middleware

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
