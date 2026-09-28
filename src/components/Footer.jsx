import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/img/logo.png'
import yl from '../assets/img/yl_png_logo.avif'
import { useState, useEffect } from 'react'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  UserIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

function Footer() {
    const { cartItems } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')


    return (
        <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <img src={logo} alt="Logo" className="h-10" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link to="/about" className="hover:text-gray-300">
                            About Us
                        </Link>
                        <Link to="/contact" className="hover:text-gray-300">
                            Contact
                        </Link>
                        <Link to="/privacy" className="hover:text-gray-300">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer