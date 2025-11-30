import React from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../../UI/Button'
import styles from './Header.module.css'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (user?.role === 'teacher') return '/teacher'
    if (user?.role === 'student') return '/student'
    return '/'
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.nav}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <h1>LearningSystem</h1>
          </div>
          
          <nav className={styles.navMenu}>
            {isAuthenticated ? (
              <>
                <Button 
                  variant="secondary"
                  size="small"
                  onClick={() => navigate(getDashboardPath())}
                >
                  Панель управления
                </Button>
                <span className={styles.userInfo}>
                  {user?.username} ({user?.role})
                </span>
                <Button 
                  variant="danger"
                  size="small"
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Войти
                </Button>
                <Button 
                  variant="outline"
                  size="small"
                  onClick={() => navigate('/register')}
                >
                  Регистрация
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header