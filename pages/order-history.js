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
      return { ...state, loading: false, orders: action.payload, error: '' }

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

function OrderHistoryPage() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/history`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchOrders()
  }, [])
  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className=" p-5 ">{order._id.substring(20, 24)}</td>
                  <td className=" p-5 ">{order.createdAt.substring(0, 10)}</td>
                  <td className=" p-5 ">${order.totalPrice}</td>
                  <td className=" p-5 ">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : 'not paid'}
                  </td>
                  <td className=" p-5 ">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className=" p-5 ">
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
    </Layout>
  )
}

OrderHistoryPage.auth = true
export default OrderHistoryPage
//   const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
//     loading: true,
//     orders: [],
//     error: '',
//   })
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         dispatch({ type: 'FETCH_REQUEST' })
//         const { data } = await axios.get(`/api/orders/history `)
//         dispatch({ type: 'FETCH_SUCCESS', payload: data })
//       } catch (err) {
//         dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
//       }
//     }

//     fetchOrders()
//   }, [])
//   return (
//     <Layout title="Order History">
//       <h1 className="mb-4 text-xl font-bold">Order History</h1>
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="alert-error">{error}</div>
//       ) : (
//         <div className="overflow-auto">
//           <table className="min-w-full">
//             <thead className="boarder-b">
//               <tr>
//                 <th className="px-5 text-left uppercase">id</th>

//                 <th className="p-5 text-left uppercase">date</th>

//                 <th className="p-5 text-left uppercase">total</th>

//                 <th className="p-5 text-left uppercase">paid</th>

//                 <th className="p-5 text-left uppercase">delivered</th>

//                 <th className="p-5 text-left uppercase">action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-b">
//                   <td className="p-5">{order._id.substring(20, 24)}</td>

//                   <td className="p-5">{order.createdAt.substring(0, 10)}</td>

//                   <td className="p-5">${order.totalPrice}</td>

//                   <td className="p-5 capitalize">
//                     {order.isPaid
//                       ? `${order.paidAt.substring(0, 10)}`
//                       : 'not paid'}
//                   </td>

//                   <td className="p-5 capitalize">
//                     {order.isdelivered
//                       ? `${order.deliveredAt.substring(0, 10)}`
//                       : 'not delivered'}
//                   </td>

//                   <td className="p-5">
//                     <Link
//                       href={`/order/${order._id}`}
//                       passHref
//                       className="text-blue-500"
//                       legacyBehavior>
//                       {' '}
//                       Details
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </Layout>
//   );
// }
