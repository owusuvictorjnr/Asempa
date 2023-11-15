import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import axios from 'axios'
import { getError } from '@/utils/error'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      state
  }
}

export default function Reviews() {
  const [{ loading, reviews, error }, dispatch] = useReducer(reducer, {
    loading: true,
    reviews: [],
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    fetchData()
  }, [])

  // const { data: session } = useSession()
  return (
    <Layout title="Review">
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
              <Link href="/admin/orders" className="capitalize text-blue-500">
                orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="capitalize text-blue-500 "
              >
                products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="capitalize font-bold text-blue-500"
              >
                users
              </Link>
            </li>

            <li>
              <Link href="/admin/reviews" className="capitalize font-bold ">
                reviews
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <div className="flex justify-between">
            <hi className="mb-4 text-xl capitalize font-bold">
              client reviews
            </hi>
          </div>
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr className="text-sm md:text-sm">
                    <th className="px-5 text-left uppercase">id</th>
                    <th className="p-5 text-left uppercase">name</th>
                    <th className="p-5 text-left uppercase">rating</th>
                    <th className="p-5 text-left uppercase">comment</th>
                    <th className="p-5 text-left uppercase">product</th>
                    <th className="p-5 text-left uppercase">submitted on</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id} className="border-b">
                      <td className="p-5">
                        {review.user._id.substring(20, 24)}
                      </td>
                      <td className="p-5">{review.user.name}</td>
                      <td className="p-5">{review.name}</td>
                      <td className="p-5">{review.name}</td>
                      <td className="p-5">{review.name}</td>
                      <td className="p-5">{review.name}</td>
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

Reviews.auth = { adminOnly: true }
