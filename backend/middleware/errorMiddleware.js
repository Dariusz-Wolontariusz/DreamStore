const notFound = (req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // check for Mongoose bad Object index

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Source not found.'
    statusCode = 404
  }

  res.status(statusCode)
  res.json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export { notFound, errorHandler }
