import axios from 'axios'

// const API_URL = 'https://abuja-store-backend.onrender.com/api/upload'

const API_URL = `${import.meta.env.VITE_API_URL}/api/upload`

export const uploadImage = async (file, token) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.url
}