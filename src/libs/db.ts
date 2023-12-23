import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL!)
    console.log(`Mongo Connected: ${conn.connection.host}`)
  } catch (err: any) {
    console.log(`Error: ${err.message}`)
  }
}

export default connectDB
