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
      const { id } = req.query
      if (id) {
        await connectDB()

        const client = await Client.findById(decode(id as string))

        if (client) {
          const deleteclient = await Client.findByIdAndDelete(decode(id as string))

          if (deleteclient)
            res.status(200).json({ message: "Klient malumotlari o'chirildi", success: true })
          else res.status(400).json({ message: "Klient malumotlari noto'g'ri", success: false })
        } else res.status(400).json({ message: 'Klient topilmadi', success: false })
      }
    }
  }
}
