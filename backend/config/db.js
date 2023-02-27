import mongoose from 'mongoose'
import colors from 'colors'

mongoose.set('strictQuery', false)

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {})
    console.log(`MongoDB connected ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error ${error.message}`.red.bold)
    process.exit(1)
  }
}

export default connectDB
