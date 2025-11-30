import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../UI/Button'
import Card from '../UI/Card'
import styles from './Auth.module.css'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData.username, formData.password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.authContainer}>
      {/* Кнопка Домой в углу страницы */}
      <Button 
        variant="outline"
        size="small"
        onClick={() => navigate('/')}
        className={styles.homeButton}
      >
        🏠 Домой
      </Button>
      
      <Card padding="large" className={styles.authCard}>
        <h2>Вход в систему</h2>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button 
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        
        <p className={styles.authLink}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </Card>
    </div>
  )
}

export default Login