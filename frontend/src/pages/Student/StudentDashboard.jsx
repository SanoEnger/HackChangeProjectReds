import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import styles from './Student.module.css'

const StudentDashboard = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/student/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error)
    }
  }

  const fetchCourseDetail = async (courseId) => {
    try {
      const response = await api.get(`/student/courses/${courseId}`)
      setSelectedCourse(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке деталей курса:', error)
    }
  }

  return (
    <div className={styles.dashboard}>
      <h1>Панель студента</h1>
      
      <div className={styles.content}>
        <div className={styles.coursesSection}>
          <h2>Доступные курсы</h2>
          <div className={styles.coursesGrid}>
            {courses.map(course => (
              <div 
                key={course.id} 
                className={styles.courseCard}
                onClick={() => fetchCourseDetail(course.id)}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className={styles.courseMeta}>
                  <span>Преподаватель: ID {course.teacher_id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className={styles.courseDetail}>
            <h2>{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>
            
            <div className={styles.detailSections}>
              <div className={styles.section}>
                <h3>Лекции</h3>
                <div className={styles.placeholder}>
                  Список лекций будет доступен скоро
                </div>
              </div>
              
              <div className={styles.section}>
                <h3>Задания</h3>
                <div className={styles.placeholder}>
                  Список заданий будет доступен скоро
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {courses.length === 0 && (
        <div className={styles.emptyState}>
          <p>На данный момент нет доступных курсов</p>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard