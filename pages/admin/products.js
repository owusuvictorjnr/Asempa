import Layout from '@/components/Layout'
import { getError } from '@/utils/error'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'

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

export default function AdminProductsPage() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/products`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [])
  return (
    <Layout title="Admin Products">
      <div className="grid md:grid-cols-4 md:gap-5">
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
              <Link href="/admin/products" className="capitalize font-bold ">
                products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="capitalize text-blue-500">
                users
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <hi className="mb-4 text-xl capitalize">products</hi>
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr className="">
                    <th className="px-5 text-left uppercase">id</th>
                    <th className="p-5 text-left uppercase">name</th>
                    <th className="p-5 text-left uppercase">price</th>
                    <th className="p-5 text-left uppercase">category</th>
                    <th className="p-5 text-left uppercase">count</th>
                    <th className="p-5 text-left uppercase">rating</th>
                    <th className="p-5 text-left uppercase">actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-5">{product._id.substring(20, 24)}</td>
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">$ {product.price}</td>
                      <td className="p-5">{product.category}</td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">{product.rating}</td>
                      <td className="p-5 flex">
                        <Link href={`/admin/product/${product._id}`} className='text-blue-500'>Edit</Link>
                        &nbsp;
                        <button className="text-red-500 capitalize">
                          delete
                        </button>
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

AdminProductsPage.auth = { adminOnly: true }
