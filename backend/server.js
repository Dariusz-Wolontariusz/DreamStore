const express = require('express')
const products = require('./data/products')

const app = express()
const PORT = 5000

//middleware
// app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id)
  res.json(product)
})

app.listen(PORT, console.log(`Listening on port ${PORT}`))
