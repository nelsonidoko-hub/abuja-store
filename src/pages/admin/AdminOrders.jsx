import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllOrders } from '../../services/orderService'

function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllOrders(user.token).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Customer</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b">
              <td className="p-2">{o.user?.name} ({o.user?.email})</td>
              <td className="p-2">₦{o.totalPrice}</td>
              <td className="p-2 capitalize">{o.status}</td>
              <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminOrders