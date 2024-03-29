import type { NextApiRequest, NextApiResponse } from 'next'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/libs/db'

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '14d' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body
  if (phone) {
    await connectDB()

    const user = await User.findOne({ phone })
    if (user) {
      res.status(200).json({ token: generateToken(user._id) })
      // if (await bcryptjs.compare(password, user.password))
      //   res.status(200).json({ token: generateToken(user._id), code: 0 })
      // else
      //   res.status(400).json({
      //     success: false,
      //     message: [{ msg: 'Password is wrong', param: 'password' }],
      //   })
    } else res.status(400).json({ success: false, message: 'User not found' })
  }
}
