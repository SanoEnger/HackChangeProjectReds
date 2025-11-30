import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import Modal from '../../components/UI/Modal'
import styles from './Teacher.module.css'

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/teacher/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/teacher/courses', newCourse)
      setNewCourse({ title: '', description: '' })
      setShowCreateForm(false)
      fetchCourses()
    } catch (error) {
      console.error('Ошибка при создании курса:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Панель преподавателя</h1>
        <Button 
          variant="secondary"
          onClick={() => setShowCreateForm(true)}
        >
          Создать курс
        </Button>
      </div>

      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Создать новый курс"
      >
        <form onSubmit={handleCreateCourse}>
          <div className={styles.formGroup}>
            <label>Название курса</label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({
                ...newCourse,
                title: e.target.value
              })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({
                ...newCourse,
                description: e.target.value
              })}
              rows="4"
            />
          </div>
          <div className={styles.modalActions}>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>

      <div className={styles.coursesGrid}>
        {courses.map(course => (
          <Card key={course.id} className={styles.courseCard}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className={styles.courseActions}>
              <Button variant="outline" size="small">
                Управление
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className={styles.emptyState}>
          <p>У вас пока нет курсов. Создайте первый курс!</p>
        </div>
      )}
    </div>
  )
}

export default TeacherDashboard