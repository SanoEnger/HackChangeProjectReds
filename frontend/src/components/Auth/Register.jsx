import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../UI/Button'
import Card from '../UI/Card'
import styles from './Auth.module.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { register } = useAuth()
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

    const result = await register(formData.username, formData.password, formData.role)
    
    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className={styles.authContainer}>
        <Button 
          variant="outline"
          size="small"
          onClick={() => navigate('/')}
          className={styles.homeButton}
        >
          🏠 Домой
        </Button>
        <Card padding="large" className={styles.authCard}>
          <h2>Регистрация успешна!</h2>
          <p>Перенаправление на страницу входа...</p>
        </Card>
      </div>
    )
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
        <h2>Регистрация</h2>
        
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
          
          <div className={styles.formGroup}>
            <label htmlFor="role">Роль</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="student">Студент</option>
              <option value="teacher">Преподаватель</option>
            </select>
          </div>
          
          <Button 
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
        
        <p className={styles.authLink}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </Card>
    </div>
  )
}

export default Register