import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import Modal from '../../components/UI/Modal'
import styles from './Teacher.module.css'

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showLectureModal, setShowLectureModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [lectures, setLectures] = useState([])
  const [assignments, setAssignments] = useState([])
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: ''
  })
  const [newLecture, setNewLecture] = useState({
    title: '',
    content: '',
    file: null
  })
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: ''
  })
  const [newStudent, setNewStudent] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('students')

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

  const handleManageCourse = async (course) => {
    setSelectedCourse(course)
    setShowManageModal(true)
    await fetchEnrollments(course.id)
    await fetchLectures(course.id)
    await fetchAssignments(course.id)
  }

  const fetchEnrollments = async (courseId) => {
    try {
      const response = await api.get(`/teacher/courses/${courseId}/enrollments`)
      setEnrollments(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке студентов:', error)
    }
  }

  const fetchLectures = async (courseId) => {
    try {
      const response = await api.get(`/teacher/courses/${courseId}/lectures`)
      setLectures(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке лекций:', error)
    }
  }

  const fetchAssignments = async (courseId) => {
    try {
      const response = await api.get(`/teacher/courses/${courseId}/assignments`)
      setAssignments(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке заданий:', error)
    }
  }

  const handleEnrollStudent = async (e) => {
    e.preventDefault()
    if (!newStudent.trim()) return

    try {
      await api.post(`/teacher/courses/${selectedCourse.id}/enroll`, {
        student_username: newStudent
      })
      setNewStudent('')
      await fetchEnrollments(selectedCourse.id)
    } catch (error) {
      console.error('Ошибка при добавлении студента:', error)
      alert('Ошибка: ' + (error.response?.data?.detail || 'Не удалось добавить студента'))
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить студента из курса?')) return

    try {
      await api.delete(`/teacher/courses/${selectedCourse.id}/students/${studentId}`)
      await fetchEnrollments(selectedCourse.id)
    } catch (error) {
      console.error('Ошибка при удалении студента:', error)
    }
  }

  const handleCreateLecture = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', newLecture.title)
    formData.append('content', newLecture.content)
    if (newLecture.file) {
      formData.append('file', newLecture.file)
    }

    try {
      await api.post(`/teacher/courses/${selectedCourse.id}/lectures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setNewLecture({ title: '', content: '', file: null })
      setShowLectureModal(false)
      await fetchLectures(selectedCourse.id)
    } catch (error) {
      console.error('Ошибка при создании лекции:', error)
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/teacher/courses/${selectedCourse.id}/assignments`, newAssignment)
      setNewAssignment({ title: '', description: '' })
      setShowAssignmentModal(false)
      await fetchAssignments(selectedCourse.id)
    } catch (error) {
      console.error('Ошибка при создании задания:', error)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/teacher/courses/${selectedCourse.id}`, {
        title: selectedCourse.title,
        description: selectedCourse.description
      })
      setShowManageModal(false)
      fetchCourses()
    } catch (error) {
      console.error('Ошибка при обновлении курса:', error)
    }
  }

  const handleDeleteCourse = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот курс?')) return

    try {
      await api.delete(`/teacher/courses/${selectedCourse.id}`)
      setShowManageModal(false)
      fetchCourses()
    } catch (error) {
      console.error('Ошибка при удалении курса:', error)
    }
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

      {/* Модальное окно создания курса */}
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

      {/* Модальное окно управления курсом */}
      <Modal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        title={`Управление курсом: ${selectedCourse?.title}`}
        className={styles.manageModal}
      >
        {selectedCourse && (
          <div className={styles.manageContent}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'students' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('students')}
              >
                Студенты
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'lectures' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('lectures')}
              >
                Лекции
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'assignments' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('assignments')}
              >
                Задания
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'edit' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                Редактировать
              </button>
            </div>

            {activeTab === 'students' && (
              <div className={styles.tabContent}>
                <form onSubmit={handleEnrollStudent} className={styles.enrollForm}>
                  <div className={styles.formGroup}>
                    <label>Добавить студента (по username)</label>
                    <div className={styles.enrollInputGroup}>
                      <input
                        type="text"
                        value={newStudent}
                        onChange={(e) => setNewStudent(e.target.value)}
                        placeholder="Введите username студента"
                      />
                      <Button type="submit" variant="primary" size="small">
                        Добавить
                      </Button>
                    </div>
                  </div>
                </form>

                <div className={styles.studentsList}>
                  <h4>Записанные студенты:</h4>
                  {enrollments.length === 0 ? (
                    <p className={styles.noStudents}>Нет записанных студентов</p>
                  ) : (
                    enrollments.map(enrollment => (
                      <div key={enrollment.id} className={styles.studentItem}>
                        <span>{enrollment.student.username}</span>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleRemoveStudent(enrollment.student.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'lectures' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h4>Лекции курса</h4>
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={() => setShowLectureModal(true)}
                  >
                    + Добавить лекцию
                  </Button>
                </div>

                {lectures.length === 0 ? (
                  <p className={styles.noItems}>Лекции пока не добавлены</p>
                ) : (
                  <div className={styles.itemsList}>
                    {lectures.map(lecture => (
                      <div key={lecture.id} className={styles.itemCard}>
                        <div className={styles.itemInfo}>
                          <h5>{lecture.title}</h5>
                          <p>{lecture.content || 'Без описания'}</p>
                          {lecture.file_path && (
                            <span className={styles.fileBadge}>Файл прикреплен</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className={styles.tabContent}>
                <div className={styles.sectionHeader}>
                  <h4>Задания курса</h4>
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={() => setShowAssignmentModal(true)}
                  >
                    + Добавить задание
                  </Button>
                </div>

                {assignments.length === 0 ? (
                  <p className={styles.noItems}>Задания пока не добавлены</p>
                ) : (
                  <div className={styles.itemsList}>
                    {assignments.map(assignment => (
                      <div key={assignment.id} className={styles.itemCard}>
                        <div className={styles.itemInfo}>
                          <h5>{assignment.title}</h5>
                          <p>{assignment.description || 'Без описания'}</p>
                          <span className={styles.submissionsBadge}>
                            Ответов: {assignment.submissions_count || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'edit' && (
              <div className={styles.tabContent}>
                <form onSubmit={handleUpdateCourse}>
                  <div className={styles.formGroup}>
                    <label>Название курса</label>
                    <input
                      type="text"
                      value={selectedCourse.title}
                      onChange={(e) => setSelectedCourse({
                        ...selectedCourse,
                        title: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Описание</label>
                    <textarea
                      value={selectedCourse.description || ''}
                      onChange={(e) => setSelectedCourse({
                        ...selectedCourse,
                        description: e.target.value
                      })}
                      rows="4"
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <Button 
                      type="submit" 
                      variant="primary"
                    >
                      Сохранить изменения
                    </Button>
                  </div>
                </form>

                <div className={styles.dangerZone}>
                  <h4>Опасная зона</h4>
                  <Button 
                    variant="danger"
                    onClick={handleDeleteCourse}
                  >
                    Удалить курс
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Модальное окно добавления лекции */}
      <Modal
        isOpen={showLectureModal}
        onClose={() => setShowLectureModal(false)}
        title="Добавить лекцию"
      >
        <form onSubmit={handleCreateLecture}>
          <div className={styles.formGroup}>
            <label>Название лекции</label>
            <input
              type="text"
              value={newLecture.title}
              onChange={(e) => setNewLecture({
                ...newLecture,
                title: e.target.value
              })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={newLecture.content}
              onChange={(e) => setNewLecture({
                ...newLecture,
                content: e.target.value
              })}
              rows="4"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Файл (опционально)</label>
            <input
              type="file"
              onChange={(e) => setNewLecture({
                ...newLecture,
                file: e.target.files[0]
              })}
            />
          </div>
          <div className={styles.modalActions}>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowLectureModal(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Добавить лекцию
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно добавления задания */}
      <Modal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        title="Добавить задание"
      >
        <form onSubmit={handleCreateAssignment}>
          <div className={styles.formGroup}>
            <label>Название задания</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({
                ...newAssignment,
                title: e.target.value
              })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({
                ...newAssignment,
                description: e.target.value
              })}
              rows="4"
            />
          </div>
          <div className={styles.modalActions}>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowAssignmentModal(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Добавить задание
            </Button>
          </div>
        </form>
      </Modal>

      <div className={styles.coursesGrid}>
        {courses.map(course => (
          <Card key={course.id} className={styles.courseCard}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className={styles.courseStats}>
              <span>Студентов: {course.enrollments?.length || 0}</span>
              <span>Лекций: {course.lectures?.length || 0}</span>
              <span>Заданий: {course.assignments?.length || 0}</span>
            </div>
            <div className={styles.courseActions}>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => handleManageCourse(course)}
              >
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