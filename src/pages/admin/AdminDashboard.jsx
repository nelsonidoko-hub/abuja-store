import { Link } from 'react-router-dom'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       


function AdminDashboard() {
  return (
    <div>
      {/* <Navbar /> */}
      <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <p className="mb-6">Use the links below to manage products, view orders, and manage customers.</p>

      {/* <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1> */}

      <h2 className="text-2xl font-bold mt-20 mb-6">Admin Dashboard</h2>
      <div className="flex gap-4">
        <Link to="/admin/products" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          View Orders
        </Link>
        <Link to="/admin/customers" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Customers
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard