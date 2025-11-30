import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import Modal from '../../components/UI/Modal'
import styles from './Student.module.css'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('available')
  const [availableCourses, setAvailableCourses] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseDetail, setCourseDetail] = useState(null)
  const [lectures, setLectures] = useState([])
  const [assignments, setAssignments] = useState([])
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAvailableCourses()
    fetchMyCourses()
  }, [])

  const fetchAvailableCourses = async () => {
    try {
      const response = await api.get('/student/courses')
      setAvailableCourses(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error)
    }
  }

  const fetchMyCourses = async () => {
    try {
      const response = await api.get('/student/my-courses')
      setMyCourses(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке моих курсов:', error)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/student/courses/${courseId}/enroll`)
      alert('Вы успешно записались на курс!')
      fetchAvailableCourses()
      fetchMyCourses()
      setShowCourseModal(false)
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.detail || 'Не удалось записаться на курс'))
    }
  }

  const viewCourseDetails = async (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
    
    try {
      const [detailResponse, lecturesResponse, assignmentsResponse] = await Promise.all([
        api.get(`/student/courses/${course.id}`),
        api.get(`/student/courses/${course.id}/lectures`),
        api.get(`/student/courses/${course.id}/assignments`)
      ])
      
      setCourseDetail(detailResponse.data)
      setLectures(lecturesResponse.data)
      setAssignments(assignmentsResponse.data)
    } catch (error) {
      console.error('Ошибка при загрузке деталей курса:', error)
    }
  }

  const downloadFile = (filePath) => {
    // Создаем ссылку для скачивания файла
    const link = document.createElement('a')
    link.href = `http://localhost:8000/${filePath}`
    link.target = '_blank'
    link.download = filePath.split('/').pop()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Панель студента</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'available' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Доступные курсы
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'my' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('my')}
        >
          Мои курсы
        </button>
      </div>

      <div className={styles.coursesSection}>
        {activeTab === 'available' && (
          <>
            <h2>Доступные для записи курсы</h2>
            <div className={styles.coursesGrid}>
              {availableCourses.map(course => (
                <Card key={course.id} className={styles.courseCard}>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className={styles.courseTeacher}>
                    Преподаватель: {course.teacher?.username || `ID ${course.teacher_id}`}
                  </div>
                  <div className={styles.courseActions}>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => viewCourseDetails(course)}
                    >
                      Подробнее
                    </Button>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Записаться
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            {availableCourses.length === 0 && (
              <div className={styles.emptyState}>
                <p>Нет доступных курсов для записи</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'my' && (
          <>
            <h2>Мои курсы</h2>
            <div className={styles.coursesGrid}>
              {myCourses.map(course => (
                <Card key={course.id} className={styles.courseCard}>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className={styles.courseTeacher}>
                    Преподаватель: {course.teacher?.username || `ID ${course.teacher_id}`}
                  </div>
                  <div className={styles.courseStats}>
                    <span>Лекций: {course.lectures?.length || 0}</span>
                    <span>Заданий: {course.assignments?.length || 0}</span>
                  </div>
                  <div className={styles.courseActions}>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => viewCourseDetails(course)}
                    >
                      Изучать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            {myCourses.length === 0 && (
              <div className={styles.emptyState}>
                <p>Вы еще не записались ни на один курс</p>
                <p>Перейдите во вкладку "Доступные курсы" чтобы выбрать курс</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Модальное окно деталей курса */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={selectedCourse?.title}
        className={styles.courseModal}
      >
        {courseDetail && (
          <div className={styles.courseDetail}>
            <div className={styles.courseInfo}>
              <p><strong>Описание:</strong> {courseDetail.description || 'Нет описания'}</p>
              <p><strong>Преподаватель:</strong> {courseDetail.teacher_name || `ID ${courseDetail.teacher_id}`}</p>
              <p><strong>Статус:</strong> 
                <span className={courseDetail.is_enrolled ? styles.enrolledStatus : styles.notEnrolledStatus}>
                  {courseDetail.is_enrolled ? ' Вы записаны' : ' Не записан'}
                </span>
              </p>
            </div>

            {courseDetail.is_enrolled ? (
              <div className={styles.courseContent}>
                <div className={styles.contentSection}>
                  <h4>📚 Лекции</h4>
                  {lectures.length === 0 ? (
                    <p className={styles.noContent}>Лекции пока не добавлены</p>
                  ) : (
                    <div className={styles.itemsList}>
                      {lectures.map(lecture => (
                        <div key={lecture.id} className={styles.itemCard}>
                          <div className={styles.itemInfo}>
                            <h5>{lecture.title}</h5>
                            <p>{lecture.content || 'Без описания'}</p>
                            {lecture.file_path && (
                              <div className={styles.fileSection}>
                                <Button 
                                  variant="outline" 
                                  size="small"
                                  onClick={() => downloadFile(lecture.file_path)}
                                >
                                  📎 Скачать материал
                                </Button>
                                <span className={styles.fileName}>
                                  {lecture.file_path.split('/').pop()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.contentSection}>
                  <h4>📝 Задания</h4>
                  {assignments.length === 0 ? (
                    <p className={styles.noContent}>Задания пока не добавлены</p>
                  ) : (
                    <div className={styles.itemsList}>
                      {assignments.map(assignment => (
                        <div key={assignment.id} className={styles.itemCard}>
                          <div className={styles.itemInfo}>
                            <h5>{assignment.title}</h5>
                            <p>{assignment.description || 'Без описания'}</p>
                            <div className={styles.assignmentActions}>
                              <Button variant="primary" size="small">
                                Выполнить задание
                              </Button>
                              <span className={styles.deadline}>
                                Срок сдачи: не указан
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.enrollSection}>
                <p>Хотите присоединиться к этому курсу?</p>
                <Button 
                  variant="primary"
                  onClick={() => handleEnroll(selectedCourse.id)}
                >
                  Записаться на курс
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StudentDashboard