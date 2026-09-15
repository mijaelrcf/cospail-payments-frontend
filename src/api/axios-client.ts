import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined

if (!baseURL) {
  console.warn('VITE_API_BASE_URL no está definida. Revisa tu archivo .env')
}

export const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})
