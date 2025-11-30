import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import styles from './Home.module.css'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  console.log('Home Debug:', { isAuthenticated, user })

  const getDashboardPath = () => {
    console.log('User role:', user?.role)
    if (user?.role === 'teacher') return '/teacher'
    if (user?.role === 'student') return '/student'
    return '/'
  }

  const handleDashboardClick = () => {
    const path = getDashboardPath()
    console.log('Navigating to:', path)
    navigate(path)
  }

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1>Добро пожаловать в LearningSystem</h1>
        <p>Инновационная платформа для онлайн-обучения</p>
        
        {isAuthenticated ? (
          <div className={styles.actions}>
            <div className={styles.userInfo}>
              <p>Вы вошли как: <strong>{user?.username}</strong></p>
              <p>Роль: <strong>{user?.role}</strong></p>
            </div>
            <Button 
              variant="secondary"
              size="large"
              onClick={handleDashboardClick}
            >
              Перейти в панель управления
            </Button>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button 
              variant="secondary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Войти в систему
            </Button>
            <Button 
              variant="outline"
              size="large"
              onClick={() => navigate('/register')}
            >
              Зарегистрироваться
            </Button>
          </div>
        )}
      </div>
      
      <div className={styles.features}>
        <Card className={styles.feature}>
          <h3>🎓 Для преподавателей</h3>
          <p>Создавайте курсы, загружайте материалы, оценивайте работы студентов</p>
        </Card>
        
        <Card className={styles.feature}>
          <h3>📚 Для студентов</h3>
          <p>Изучайте курсы, выполняйте задания, отслеживайте свой прогресс</p>
        </Card>
        
        <Card className={styles.feature}>
          <h3>💻 Удобный интерфейс</h3>
          <p>Современный и интуитивно понятный дизайн для комфортной работы</p>
        </Card>
      </div>
    </div>
  )
}

export default Home