import axios from 'axios'

const API_URL = 'https://abuja-store-backend.onrender.com/api/orders'

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const createOrder = async (orderData, token) => {
  const response = await axios.post(API_URL, orderData, authHeader(token))
  return response.data
}

export const getMyOrders = async (token) => {
  const response = await axios.get(`${API_URL}/my-orders`, authHeader(token))
  return response.data
}

export const getAllOrders = async (token) => {
  const response = await axios.get(API_URL, authHeader(token))
  return response.data
}

export const updateOrderStatus = async (orderId, status, token) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/status`,
    { status },
    authHeader(token)
  )
  return response.data
}

export const getOrdersByUserId = async (userId, token) => {
  const response = await axios.get(`${API_URL}/user/${userId}`, authHeader(token))
  return response.data
}