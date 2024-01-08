import type { NextApiRequest, NextApiResponse } from 'next'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'
import connectDB from '@/libs/db'

// @ts-ignore
const salt = await bcryptjs.genSalt(10)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, password, phone } = req.body
  if (username && email && password && phone) {
    await connectDB()

    const userExists = await User.findOne({ email })
    const phoneExists = await User.findOne({ phone })

    if (userExists || phoneExists)
      res.status(400).json({
        success: false,
        message: [{ msg: 'User already exists', param: userExists ? 'email' : 'phone' }],
      })
    else {
      const hashedPassword = await bcryptjs.hash(password, salt)
      const user = await User.create({ ...req.body, password: hashedPassword })

      if (user) res.status(201).json({ message: 'User added', success: true })
      else res.status(400).json({ success: false, message: 'Invalid user data' })
    }
  } else
    res.status(400).json({
      success: false,
      message: 'All fields are required: username, email, password, phone',
    })
}
