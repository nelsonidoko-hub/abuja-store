import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllOrders, updateOrderStatus } from '../../services/orderService'

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const data = await getAllOrders(user.token)
    setOrders(data)
    setLoading(false)
  }

  async function handleStatusChange(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus, user.token)
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const filteredOrders =
    filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus)

  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((sum, o) => sum + o.totalPrice, 0)

  if (loading) return <p className="p-6">Loading orders...</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Pending</p>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Delivered</p>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Revenue</p>
          <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={
              filterStatus === s
                ? 'px-3 py-1 rounded-full text-sm bg-gray-900 text-white capitalize'
                : 'px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 capitalize hover:bg-gray-200'
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <>
                <tr key={order._id} className="border-t">
                  <td className="p-3 font-mono text-xs">{order._id.slice(-8)}</td>
                  <td className="p-3">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-gray-500 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold">₦{order.totalPrice.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={
                        order.isPaid
                          ? 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-800'
                          : 'text-xs px-2 py-1 rounded-full bg-red-100 text-red-800'
                      }
                    >
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs rounded-md px-2 py-1 capitalize border-0 ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {expandedId === order._id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>

                {expandedId === order._id && (
                  <tr className="border-t bg-gray-50">
                    <td colSpan={7} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                          <p className="text-sm text-gray-700">{order.shippingAddress?.address}</p>
                          <p className="text-sm text-gray-700">{order.shippingAddress?.city}</p>
                          <p className="text-sm text-gray-700">{order.shippingAddress?.phone}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p>{item.name} ({item.size})</p>
                                  <p className="text-gray-500 text-xs">
                                    Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {order.paymentReference && (
                        <p className="text-xs text-gray-400 mt-4">
                          Payment ref: {order.paymentReference}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="p-6 text-center text-gray-500">No orders in this category.</p>
        )}
      </div>
    </div>
  )
}

export default AdminOrders