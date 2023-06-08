import Layout from '@/components/Layout'
import { Store } from '@/utils/Store'
import data from '@/utils/data'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  const { query } = useRouter()
  const { slug } = query
  const product = data.products.find((x) => x.slug === slug)
  if (!product) {
    return <div>Product Not found</div>
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })

    if (product.countInStock < quantity) {
      alert('Sorry, Product is out of stock')
      return
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    router.push('/cart')
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>

      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            reponsive={true}
            className=""
          />
        </div>

        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Categoty: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>

        {/* Right Status (Price and Payment Details) */}
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>$ {product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'in stock' : 'Unavailable'}</div>
            </div>
            <button className="primary-btn w-full" onClick={addToCartHandler}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}