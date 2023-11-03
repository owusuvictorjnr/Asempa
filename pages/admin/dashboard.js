import Layout from '@/components/Layout'
import { getError } from '@/utils/error'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' }

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      state
  }
}

function AdminDashboardPage() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/summary`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    fetchData()
  }, [])

  const data = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162, 222, 208,1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="mt-[10rem] md:mt-[5rem]">
          <ul>
            <li>
              <Link href="/admin/dashboard" className="font-bold capitalize">
                dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className=" capitalize text-blue-500">
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
          </ul>
        </div>

        {/* Menu section */}
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl font-bold capitalize">admin dashboard</h1>
          {loading ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card m-5 p-5">
                  <p className="md:text-xl md:font-bold text-3xl">
                    ${summary.ordersPrice}
                  </p>
                  <p>Sales</p>
                  <Link href="/admin/orders" className="text-blue-500">
                    View sales
                  </Link>
                </div>

                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.ordersCount}</p>
                  <p>Orders</p>
                  <Link href="/admin/orders" className="text-blue-500">
                    View orders
                  </Link>
                </div>

                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.productsCount}</p>
                  <p>Products</p>
                  <Link href="/admin/products" className="text-blue-500">
                    View products
                  </Link>
                </div>

                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.usersCount}</p>
                  <p>Users</p>
                  <Link href="/admin/users" className="text-blue-500">
                    View users
                  </Link>
                </div>
              </div>
              {/* Sales Report */}
              <h2 className="text-xl font-bold">Sales Report</h2>
              <Bar
                options={{
                  legend: { display: true, position: 'right' },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminDashboardPage.auth = { adminOnly: true }
export default AdminDashboardPage
