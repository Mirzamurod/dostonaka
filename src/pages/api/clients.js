import Client from '@/models/clientModel'
import User from '@/models/userModel'
import { decode } from 'js-base64'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  let token

  token = decode(req.headers.authorization.split(' ')[1])

  // Verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  // Get user from the token
  const user = await User.findById(decoded.id).select('-password')

  if (!user) res.status(400).json({ success: false, message: 'User not found !!!' })
  else {
    const { limit, page, sortName, sortValue, id } = req.query
    if (id) {
      const client = await Client.findById(decode(id))

      if (client) res.status(200).json(client)
      else res.status(400).json({ message: 'Klient topilmadi', success: false })
    } else if (+limit && +page) {
      const clients = await Client.find({ user: user._id })
        .sort(sortValue ? { [sortName]: sortValue } : sortName)
        .limit(+limit)
        .skip(+limit * (+page - 1))

      const pageLists = Math.ceil((await Client.find({ user: user._id })).length / limit)

      res.status(200).json({ data: clients, pageLists, page })
    } else {
      const clients = await Client.find({ user: user._id }).sort(
        sortValue ? { [sortName]: sortValue } : sortName
      )
      res.status(200).json({ data: clients })
    }
  }
}
