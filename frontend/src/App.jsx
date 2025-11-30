import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import TeacherDashboard from './pages/Teacher/TeacherDashboard'
import StudentDashboard from './pages/Student/StudentDashboard'
import Home from './pages/Home/Home'
import styles from './App.module.css'

// Временный компонент для отладки
const DebugRoute = ({ children, path }) => {
  console.log(`Rendering route: ${path}`)
  console.log('Token in localStorage:', localStorage.getItem('token'))
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Временно убираем ProtectedRoute для тестирования */}
            <Route path="/teacher/*" element={
              <DebugRoute path="/teacher">
                <Layout>
                  <TeacherDashboard />
                </Layout>
              </DebugRoute>
            } />
            <Route path="/student/*" element={
              <DebugRoute path="/student">
                <Layout>
                  <StudentDashboard />
                </Layout>
              </DebugRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App