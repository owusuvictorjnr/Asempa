import Layout from '@/components/Layout'
import { getError } from '@/utils/error'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }

    default:
      return state
  }
}

function AdminUsersPage() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, { loading: true, users: [], error: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/users`)
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

  const deleteHandler = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/users/${userId}`)
      dispatch({ type: 'DELETE_SUCCESS' })
      toast.success('User deleted successfully')
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast.error(getError(err))
    }
  }
  return (
    <Layout title="Users">
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
              <Link href="/admin/users" className="capitalize font-bold ">
                users
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl capitalize font-bold">users</h1>
          {loadingDelete && <div className="">Deleting...</div>}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left uppercase">id</th>
                    <th className="p-5 text-left uppercase">name</th>
                    <th className="p-5 text-left uppercase">email</th>
                    <th className="p-5 text-left uppercase">admin</th>
                    <th className="p-5 text-left uppercase">actions</th>
                  </tr>
                </thead>

                <tbody className="">
                  {users.map((user) => (
                    <tr className=" border-b" key={user._id}>
                      <td className="p-5">{user._id.substring(20, 24)}</td>
                      <td className="p-5">{user.name}</td>
                      <td className="p-5">{user.email}</td>
                      <td className="p-5">{user.isAdmin ? 'YES' : 'NO'}</td>
                      <td className="p-5">
                        <Link
                          className="hover:text-blue-500 capitalize default-btn"
                          type="button"
                          href={`/admin/users/${user._id}`}
                          passHref
                        >
                          edit
                        </Link>
                        &nbsp;
                        <button
                          className="hover:text-red-500 capitalize default-btn"
                          onClick={() => deleteHandler(user._id)}
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
AdminUsersPage.auth = { adminOnly: true }
export default AdminUsersPage
