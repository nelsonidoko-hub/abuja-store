import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../services/authService'

const AuthContext = createContext()

function getStoredUser() {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

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
    <AuthContext.Provider value={{ user, login, register, logout, setUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}