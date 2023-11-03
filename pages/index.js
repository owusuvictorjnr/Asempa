import Layout from '@/components/Layout'
import ProductItem from '@/components/ProductItem'
import Product from '@/models/Product'
import { Store } from '@/utils/Store'
import db from '@/utils/db'
import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      return toast.error('Sorry, Product is out of stock')
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })

    toast.success('Product added successfully')
  }

  return (
    <Layout title="Home Page">
      <Carousel
        className="mt-[3rem]"
        showThumbs={false}
        autoPlay={true}
        infiniteLoop
      >
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link
              href={`/product/${product.slug}`}
              passHref
              className="flex "
              legacyBehavior
            >
              <Image
                src={product.banner}
                alt={product.name}
                height={1000}
                width={1000}
                className="w-full h-[20rem] lg:h-[40rem]"
              />
            </Link>
          </div>
        ))}
      </Carousel>

      <h2 className="capitalize h-2 my-4 font-bold">latest products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find().lean()
  const featuredProducts = await Product.find({ isFeatured: true }).lean()

  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  }
}
