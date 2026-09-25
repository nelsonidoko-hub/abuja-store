import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { verifyPayment } from '../services/paymentService'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const { user } = useAuth()
  const { setCartItems } = useCart()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    async function verify() {
      try {
        const result = await verifyPayment(reference, user.token)
        if (result.status === 'success') {
          setStatus('success')
          localStorage.removeItem('cartItems')
          setCartItems?.([])
        } else {
          setStatus('failed')
        }
      } catch (err) {
        setStatus('failed')
      }
    }

    if (reference && user) verify()
  }, [reference, user])

  if (status === 'verifying') return <p>Verifying payment...</p>

  if (status === 'success') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-green-600">Payment successful!</h2>
        <Link to="/" className="text-blue-600 underline">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-600">Payment verification failed</h2>
      <Link to="/cart" className="text-blue-600 underline">Back to cart</Link>
    </div>
  )
}

export default PaymentSuccess