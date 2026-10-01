import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Cart from '../pages/Cart'
import Footer from './Footer'

function PublicLayout() {
  return (
    <div>
      <Navbar />
      <Cart />
      
      <Outlet />
      <Footer />
    </div>
  )
}

export default PublicLayout