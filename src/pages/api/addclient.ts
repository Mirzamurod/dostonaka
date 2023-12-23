import connectDB from '@/libs/db'
import Client from '@/models/clientModel'
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
      const { name, price } = req.body
      if (name && price) {
        await connectDB()
        const clientExist = await Client.findOne({ name })

        if (clientExist)
          res.status(400).json({
            success: false,
            message: [{ msg: 'Bunday ismli klient bor', param: 'name' }],
          })
        else {
          const client = await Client.create({ name, price, user: user._id })

          if (client) res.status(201).json({ message: 'Client added', success: true })
          else res.status(400).json({ message: 'Invalid client data', success: true })
        }
      } else
        res.status(400).json({ success: false, message: 'All fields are required: name, price' })
    }
  }
}
