import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema(
  {
    price: { type: String, required: true },
    user: { type: String, required: true },
    client: { type: String, required: true },
    count: { type: Number, required: true },
    date: { type: String, required: true },
    item_price: { type: Number, required: true },
  },
  { timestamps: true }
)

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order
