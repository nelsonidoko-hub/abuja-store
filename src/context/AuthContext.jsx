import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const data = await loginUser(email, password)
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  async function register(name, email, password) {
    const data = await registerUser(name, email, password)
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}