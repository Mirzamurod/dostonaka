import mongoose, { Schema } from 'mongoose'

const clientSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    user: { type: String, required: true },
    show: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
)

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema)

export default Client
