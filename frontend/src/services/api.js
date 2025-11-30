// api.js - ДОБАВИМ ОТЛАДКУ
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерцептор для автоматической подстановки токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url)
    console.log('🔐 Token in request:', token ? 'YES' : 'NO')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Authorization header added')
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url)
    console.error('Error details:', error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - removing token')
      localStorage.removeItem('token')
      // Не перенаправляем автоматически, пусть компоненты обрабатывают
    }
    return Promise.reject(error)
  }
)

export default api