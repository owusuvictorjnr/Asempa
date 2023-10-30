import CheckoutWizard from '@/components/CheckoutWizard'
import Layout from '@/components/Layout'
import { Store } from '@/utils/Store'
import { getError } from '@/utils/error'
import axios from 'axios'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function PlaceOrderPage() {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { cartItems, shippingAddress, paymentMethod } = cart

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )

  // Shipping Offer
  const shippingPrice = itemsPrice > 200 ? 0 : 15

  // Tax
  const taxPrice = round2(itemsPrice * 0.15)

  // Total Price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  const router = useRouter()

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
    }
  }, [paymentMethod, router])

  const [loading, setLoading] = useState(false)

  const placeOrderHandler = async () => {
    try {
      setLoading(true)

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          withCredentials: true,
        }
      )

      // Are you using cookies or jwt?

      // both but cookies for the clientside storage

      // does it mean the user is sendt along with the payload  authormatic?

      // yes it should send with the payload authormatic


      // try again and let me see

      setLoading(false)
      dispatch({ type: 'CART_CLEAR_ITEMS' })
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      )

      router.push(`/order/${data._id}`)
    } catch (err) {
      setLoading(false)
      toast.error(getError(err))

      console.error(err)
    }
  }
  // console.log(data._id)
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl capitalize font-bold">place order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{' '}
          <Link href="/" className="text-blue-500">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              {/* Shippimg Address */}
              <h2 className="mb-2 text-lg capitalize">shopping address</h2>
              <div>
                Name: {shippingAddress.fullName}, Addresss:{' '}
                {shippingAddress.address}, City: {shippingAddress.city},
                PostalCode: {shippingAddress.postalCode}, Country:{' '}
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/shipping" className="text-blue-500">
                  Edit
                </Link>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-5">
              <h2 className="mb-2 text-lg capitalize font-bold">
                payment method
              </h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment" className="text-blue-500">
                  Edit
                </Link>
              </div>
            </div>

            {/* Order Items */}
            <div className="card overflow-x-auto p-5 mt-5">
              <h2 className="mb-2 text-lg capitalize">order items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart" className="text-blue-500">
                  Edit
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg capitalize font-bold">
                order summary
              </h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>

                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-btn w-full"
                  >
                    {loading ? 'Loading...' : 'Place Order'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

PlaceOrderPage.auth = true
// export default PlaceOrderPage
