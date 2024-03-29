import Layout from '@/components/Layout'
import { getError } from '@/utils/error'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' }

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

export default function AdminOrderPage() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/orders`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    fetchData()
  }, [])
  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5 mt-[5rem]">
        <div>
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className="capitalize text-blue-500"
              >
                dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="font-bold capitalize">
                orders
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="capitalize text-blue-500">
                products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="capitalize text-blue-500">
                users
              </Link>
            </li>

            <li>
              <Link href="/admin/reviews" className="capitalize text-blue-500">
                reviews
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl font-bold capitalize">admin orders</h1>

          {loading ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left uppercase">id</th>
                    <th className="p-5 text-left uppercase">user</th>
                    <th className="p-5 text-left uppercase">date</th>
                    <th className="p-5 text-left uppercase">total</th>
                    <th className="p-5 text-left uppercase">paid</th>
                    <th className="p-5 text-left uppercase">delivered</th>
                    <th className="p-5 text-left uppercase">action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substring(20, 24)}</td>

                      <td className="p-5">
                        {order.user ? order.user.name : 'DELETED USER'}
                      </td>

                      <td className="p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>

                      <td className="p-5">${order.totalPrice}</td>

                      <td className="p-5">
                        {order.isPaid
                          ? `${order.paidAt.substring(0, 10)}`
                          : 'not paid'}
                      </td>

                      <td className="p-5">
                        {order.isDelivered
                          ? `${order.deliveredAt.substring(0, 10)}`
                          : 'not delivered'}
                      </td>

                      <td className="p-5">
                        <Link
                          href={`/order/${order._id}`}
                          className="text-blue-500"
                          passHref
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminOrderPage.auth = { adminOnly: true }
