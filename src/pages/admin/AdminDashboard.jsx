import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex gap-4">
        <Link to="/admin/products" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          View Orders
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard