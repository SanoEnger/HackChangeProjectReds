import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth()
  
  console.log('ProtectedRoute Debug:', { 
    isAuthenticated, 
    user, 
    requiredRole,
    loading,
    token: localStorage.getItem('token')
  })
  
  if (loading) {
    return <div>Загрузка...</div>
  }
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return <Navigate to="/login" />
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Role mismatch: required ${requiredRole}, but user has ${user?.role}`)
    return <Navigate to="/" />
  }
  
  console.log('Access granted to protected route')
  return children
}

export default ProtectedRoute