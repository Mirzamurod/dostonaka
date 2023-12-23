import connectDB from '@/libs/db'
import Order from '@/models/orderModel'
import User from '@/models/userModel'
import { decode } from 'js-base64'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = decode(req.headers.authorization.split(' ')[1])

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

    // Get user from the token
    // @ts-ignore
    const user = await User.findById(decoded.id).select('-password')

    if (!user) res.status(400).json({ success: false, message: 'User not found !!!' })
    else {
      const { id } = req.query
      await connectDB()
      const existOrder = await Order.findById(id)

      if (existOrder) {
        const deletedOrder = await Order.findByIdAndDelete(id)
        if (deletedOrder)
          res.status(201).json({ message: 'Order deleted successfully', success: true })
        else res.status(400).json({ message: 'Invalid order data', success: false })
      } else res.status(400).json({ message: 'Order not found', success: false })
    }
  }
}
