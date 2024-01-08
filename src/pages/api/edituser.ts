import connectDB from '@/libs/db'
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

    await connectDB()

    // Get user from the token
    // @ts-ignore
    const user = await User.findById(decoded.id).select('-password')

    if (!user) res.status(400).json({ success: false, message: 'User not found !!!' })
    else {
      const { username, phone } = req.body
      if (username && phone) {
        await User.findByIdAndUpdate(user._id, req.body)
        res.status(200).json({ success: true, message: 'User Updated' })
      } else
        res
          .status(400)
          .json({ success: false, message: 'All fields are required: username, phone, price' })
    }
  }
}
