import db from '@/utils/db'
import { getSession } from 'next-auth/react'

const { default: Order } = require('@/models/Order')

const handler = async (req, res) => {
  const session = await getSession({ req })
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('Error: sign in required ')
  }

  await db.connect()
  const order = await Order.findById(req.query.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const deliveredOrder = await order.save()
    await db.disconnect()
    res.send({ message: 'order delivered successfully', order: deliveredOrder })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'Error: Order not found' })
  }
}

export default handler
