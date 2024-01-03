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
    const { id, startDate, year, dates, search } = req.query

    const addDay = num => dayjs(startDate).add(num, 'day').format('DD.MM.YYYY')
    let datesArr = []

    if (id) {
      const client = await Client.findById(decode(id))

      if (client) res.status(200).json(client)
      else res.status(400).json({ message: 'Klient topilmadi', success: false })
    } else if (year) {
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      let orders
      let results = []
      orders = await Client.find({
        user: user._id,
        show: true,
        name: { $regex: search ?? '', $options: 'i' },
      })

      for (const client of orders) {
        client._doc.orders = []
        client._doc.total_price = 0
        client._doc.total_count = 0

        // maping months
        for (const [index, item] of months.entries()) {
          results[index] = {
            month: `${item}.${year}`,
            total_price: results[index]?.total_price || 0,
            total_count: results[index]?.total_count || 0,
          }
          await Order.find({
            user: user._id,
            client: client._id,
            date: { $regex: `${item}.${year}`, $options: 'i' },
          }).then(response => {
            client._doc.orders.push({ month: `${item}.${year}`, total_price: 0, total_count: 0 })
            for (const item_res of response) {
              client._doc.orders[index].total_price += Number(item_res?.item_price)
              client._doc.orders[index].total_count += Number(item_res?.count)
            }
          })

          results[index].total_count += client._doc.orders[index].total_count
          results[index].total_price += client._doc.orders[index].total_price
        }

        // maping orders
        for (const order of client._doc.orders) {
          client._doc.total_count += order.total_count
          client._doc.total_price += order.total_price
        }
      }

      res.status(200).json({ orders, results })
    } else {
      let orders
      let results = []

      for (let index = 0; index < dates; index++) {
        datesArr.push(addDay(index))
      }

      orders = await Client.find({
        user: user._id,
        show: true,
        name: { $regex: search ?? '', $options: 'i' },
      })

      for (const client of orders) {
        client._doc.orders = []
        client._doc.total_price = 0
        client._doc.total_count = 0
        await Order.find({ user: user._id, client: client._id, date: datesArr }).then(response => {
          client._doc.orders = response

          for (const item of response) {
            client._doc.total_price += Number(item.item_price)
            client._doc.total_count += Number(item.count)

            if (results.some(result => result.date === item.date)) {
              results.find(result => result.date === item.date).total_count += Number(item.count)
              results.find(result => result.date === item.date).total_price += Number(
                item.item_price
              )
            } else
              results.push({
                date: item.date,
                total_count: Number(item.count),
                total_price: Number(item.item_price),
              })
          }
        })
      }

      res.status(200).json({ orders, results })
    }
  }
}
