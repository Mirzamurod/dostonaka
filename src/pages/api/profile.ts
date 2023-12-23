import type { NextApiRequest, NextApiResponse } from 'next'
import { decode } from 'js-base64'
import jwt from 'jsonwebtoken'
import User from '@/models/userModel'
import connectDB from '@/libs/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      // token = req.headers.authorization.split(' ')[1]
      token = decode(req.headers.authorization.split(' ')[1])

      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

      // Get user from the token
      // @ts-ignore
      const user = await User.findById(decoded.id).select('-password')

      if (!user) res.status(400).json({ success: false, message: 'User not found !!!' })
      else res.status(200).json(user)
    } catch (error) {
      // console.log(error)
      res.status(401).json({ success: false, message: 'Not authorized' })
    }
  }

  if (!token) res.status(401).json({ success: false, message: 'Not authorized, no token' })
}
