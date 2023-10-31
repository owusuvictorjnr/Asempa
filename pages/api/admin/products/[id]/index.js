import Product from '@/models/Product'
import db from '@/utils/db'
import { getToken } from 'next-auth/jwt'

const handler = async (req, res) => {
  const user = await getToken({ req })
  if (!user || (user && !user.isAdmin)) {
    return res.status(401).send('signin required')
  }

  if (req.method === 'GET') {
    return getHandler(req, res, user)
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user)
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user)
  } else {
    return res.status(400).send({ message: 'Method not allowed' })
  }
}
const getHandler = async (req, res) => {
  await db.connect()
  const product = await Product.findById(req.query.id)
  await db.disconnect()
  res.send(product)
}
const putHandler = async (req, res) => {
  await db.connect()
  const product = await Product.findById(req.query.id)
  if (product) {
    product.name = req.body.name
    product.slug = req.body.slug
    product.price = req.body.price
    product.category = req.body.category
    product.image = req.body.image
    product.brand = req.body.brand
    product.countInStock = req.body.countInStock
    product.description = req.body.description
    await product.save()
    await db.disconnect()
    res.send({ message: 'Product updated successfully' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'Product not found' })
  }
}
const deleteHandler = async (req, res) => {
  await db.connect()
  const product = await Product.findById(req.query.id)
  if (product) {
    await product.remove()
    await db.disconnect()
    res.send({ message: 'Product deleted successfully' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'Product not found' })
  }
}
export default handler

// import Product from '@/models/Product'
// import db from '@/utils/db'
// import { getSession } from 'next-auth/react'

// const handler = async (req, res) => {
//   const session = await getSession({ req })

//   if (!session || (session && !session.user.isAdmin)) {
//     return res.status(401).send({ message: 'signin required' })
//   }

//   const { user } = session
//   if (req.method === 'GET') {
//     return getHandler(req, res, user)
//   } else if (req.method === 'PUT') {
//     return putHandler(req, res, user)
//   } else {
//     return res.status(400).send({ message: 'Method not allowed' })
//   }
// }

// const getHandler = async (req, res) => {
//   await db.connect()

//   const product = await Product.findById(req.query.id)
//   await db.disconnect()
//   res.send(product)
// }

// const putHandler = async (req, res) => {
//   await db.connect()

//   const product = await Product.findById(req.query.id)

//   if (product) {
//     product.name = req.query.name
//     product.slug = req.query.slug
//     product.price = req.query.price
//     product.category = req.query.category
//     product.image = req.query.image
//     product.brand = req.query.brand
//     product.countInStock = req.query.countInStock
//     product.description = req.query.description

//     await product.save()
//     await db.disconnect()
//     res.send({ message: 'Product updated successfully' })
//   } else {
//     await db.disconnect()
//     res.status(404).send({ message: 'Product not found' })
//   }
// }

// export default handler
