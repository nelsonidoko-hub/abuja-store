import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllCustomers } from '../../services/authService'
import { getOrdersByUserId } from '../../services/orderService'

function AdminCustomers() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerOrders, setCustomerOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const data = await getAllCustomers(user.token)
    setCustomers(data)
    setLoading(false)
  }

  async function viewCustomer(customer) {
    setSelectedCustomer(customer)
    setOrdersLoading(true)
    const orders = await getOrdersByUserId(customer._id, user.token)
    setCustomerOrders(orders)
    setOrdersLoading(false)
  }

  if (loading) return <p className="p-6">Loading customers...</p>

  if (selectedCustomer) {
    const totalSpent = customerOrders
      .filter((o) => o.isPaid)
      .reduce((sum, o) => sum + o.totalPrice, 0)

    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedCustomer(null)}
          className="text-sm text-gray-500 hover:underline mb-4"
        >
          ← Back to Customers
        </button>

        <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
        <p className="text-gray-500 mb-6">{selectedCustomer.email}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase">Total Orders</p>
            <p className="text-2xl font-bold">{customerOrders.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase">Total Spent</p>
            <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase">Joined</p>
            <p className="text-lg font-semibold">
              {new Date(selectedCustomer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Order History</h3>

        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : customerOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-3 font-mono text-xs">{order._id.slice(-8)}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">{order.items.length} item(s)</td>
                    <td className="p-3 font-semibold">₦{order.totalPrice.toLocaleString()}</td>
                    <td className="p-3 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 mt-300">
      <h2 className="text-2xl font-bold mb-6">Customers</h2>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Joined</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => viewCustomer(c)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="p-6 text-center text-gray-500">No customers yet.</p>
        )}
      </div>
    </div>
  )
}

export default AdminCustomers