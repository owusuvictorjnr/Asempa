import Product from '@/models/Product'

const { default: User } = require('@/models/User')
const { default: data } = require('@/utils/data')
const { default: db } = require('@/utils/db')

const handler = async (req, res) => {
  await db.connect()
  await User.deleteMany()
  await User.insertMany(data.users)
  await Product.deleteMany()
  await Product.insertMany(data.products)
  await db.disconnect()
  res.send({ message: 'Seeded successfully' })
}

export default handler
