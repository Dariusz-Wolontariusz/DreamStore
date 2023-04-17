import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// sugestia chat gtp
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

// moved down before deplopyment
// app.get('/', (req, res) => {
//   res.send('API is running...')
// })

//mounting productRoutes

app.use('/api/products', productRoutes)

//mounting userRoutes

app.use('/api/users', userRoutes)

// custom error handler

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'../frontend/build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
