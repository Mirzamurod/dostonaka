import Client from '@/models/clientModel'
import Order from '@/models/orderModel'
import User from '@/models/userModel'
import dayjs from 'dayjs'
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
    const { id, startDate, endDate, dates } = req.query

    const addDay = num => dayjs(startDate).add(num, 'day').format('DD.MM.YYYY')
    let datesArr = []

    if (id) {
      const client = await Client.findById(decode(id))

      if (client) res.status(200).json(client)
      else res.status(400).json({ message: 'Klient topilmadi', success: false })
    } else {
      let orders

      for (let index = 0; index < dates; index++) {
        datesArr.push(addDay(index))
      }

      orders = await Client.find({ user: user._id, show: true })

      for (const client of orders) {
        client._doc.orders = []
        client._doc.total_price = 0
        client._doc.total_count = 0
        await Order.find({ user: user._id, client: client._id, date: datesArr }).then(response => {
          client._doc.orders = response
          for (const item of response) {
            client._doc.total_price += Number(item.item_price)
            client._doc.total_count += Number(item.count)
          }
        })
      }
      res.status(200).json(orders)
    }
  }
}
