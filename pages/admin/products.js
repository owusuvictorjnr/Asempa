import Layout from '@/components/Layout'
import { getError } from '@/utils/error'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true }
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false }
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false }

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }

    default:
      state
  }
}

export default function AdminProductsPage() {
  const router = useRouter()

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  })

  const createHandler = async () => {
    if (!window.confirm('Are you sure you want to create a new porduct?')) {
      return
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' })
      const { data } = await axios.post(`/api/admin/products`)
      toast.success('Product created successfully')
      router.push(`/admin/product/${data.product._id}`)
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' })
      toast.error(getError(err))
    }
  }

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
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [successDelete])

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/products/${productId}`)
      dispatch({ type: 'DELETE_SUCCESS' })
      toast.success('Product deleted successfully')
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast.error(getError(err))
    }
  }
  return (
    <Layout title="Admin Products">
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
          <div className="flex justify-between">
            <hi className="mb-4 text-xl capitalize font-bold">admin products</hi>
            {loadingDelete && <div className="">Deleting item...</div>}
            <button
              className="primary-btn"
              onClick={createHandler}
              disabled={loadingCreate}
            >
              {loadingCreate ? 'Loading' : 'Create'}
            </button>
          </div>
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
                        <Link
                          href={`/admin/product/${product._id}`}
                          className="hover:text-blue-500 default-btn"
                          type="button"
                        >
                          Edit
                        </Link>
                        &nbsp;
                        <button
                        type='button' 
                          onClick={() => deleteHandler(product._id)}
                          className="hover:text-red-500 capitalize default-btn"
                        >
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
