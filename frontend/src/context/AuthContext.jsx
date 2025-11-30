// AuthContext.jsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Функция для получения данных пользователя
  const fetchUserData = async () => {
    try {
      console.log('👤 Fetching user data...')
      const response = await api.get('/auth/me') // или ваш эндпоинт
      const userData = response.data
      
      setUser(userData)
      setIsAuthenticated(true)
      console.log('✅ User data loaded:', userData)
      return userData
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error)
      // Если не удалось получить данные пользователя, разлогиниваем
      logout()
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      console.log('🔐 AuthContext init - Token found:', !!token)
      
      if (token) {
        // Устанавливаем токен в заголовки
        api.defaults.headers.Authorization = `Bearer ${token}`
        
        // Получаем реальные данные пользователя
        await fetchUserData()
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username, password) => {
    try {
      console.log('🔐 Login attempt for:', username)
      const response = await api.post('/auth/login', {
        username,
        password
      })
      
      const { access_token } = response.data
      console.log('✅ Login successful, token received')
      
      localStorage.setItem('token', access_token)
      api.defaults.headers.Authorization = `Bearer ${access_token}`
      
      // ПОЛУЧАЕМ РЕАЛЬНЫЕ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
      const userData = await fetchUserData()
      
      if (userData) {
        return { success: true }
      } else {
        return { 
          success: false, 
          error: 'Не удалось загрузить данные пользователя' 
        }
      }
    } catch (error) {
      console.error('❌ Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Ошибка входа' 
      }
    }
  }

  const register = async (username, password, role) => {
    try {
      console.log('👤 Register attempt for:', username, 'role:', role)
      await api.post('/auth/register', {
        username,
        password,
        role
      })
      
      // После успешной регистрации автоматически входим
      const loginResult = await login(username, password)
      return loginResult
      
    } catch (error) {
      console.error('❌ Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Ошибка регистрации' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.Authorization
    setUser(null)
    setIsAuthenticated(false)
    console.log('🚪 User logged out')
  }

  // Функция для обновления данных пользователя
  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }))
  }

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    updateUser,
    refreshUser: fetchUserData // для принудительного обновления данных
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}