import type { NextApiRequest, NextApiResponse } from 'next'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'
import connectDB from '@/libs/db'

// @ts-ignore
const salt = await bcryptjs.genSalt(10)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, password } = req.body
  if (username && email && password) {
    await connectDB()

    const userExists = await User.findOne({ email })

    if (userExists)
      res.status(400).json({
        success: false,
        message: [{ msg: 'User already exists', param: 'email' }],
      })
    else {
      const hashedPassword = await bcryptjs.hash(password, salt)
      const user = await User.create({ username, email, password: hashedPassword })

      if (user) res.status(201).json({ message: 'User added', success: true })
      else res.status(400).json({ success: false, message: 'Invalid user data' })
    }
  } else
    res
      .status(400)
      .json({ success: false, message: 'All fields are required: username, email, password' })
}
