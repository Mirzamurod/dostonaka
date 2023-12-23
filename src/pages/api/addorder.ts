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
      const { price, count, date, client } = req.body
      if (price && count && date) {
        await connectDB()
        const order = await Order.create({
          price,
          user: user._id,
          client,
          count,
          date,
          item_price: Number(price) * Number(count),
        })

        if (order) res.status(201).json({ message: 'Order added', success: true })
        else res.status(400).json({ message: 'Invalid order data', success: false })
      } else
        res
          .status(400)
          .json({ success: false, message: 'All fields are required: price, count, date' })
    }
  }
}
