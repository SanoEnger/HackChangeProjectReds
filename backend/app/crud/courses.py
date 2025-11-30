from sqlalchemy.orm import Session
from .. import models
from fastapi import HTTPException

def create_course(db: Session, title: str, description: str, teacher_id: int):
    course = models.Course(title=title, description=description, teacher_id=teacher_id)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def get_courses_by_teacher(db: Session, teacher_id: int):
    return db.query(models.Course).filter(models.Course.teacher_id == teacher_id).all()

def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def update_course(db: Session, course_id: int, title: str = None, description: str = None, teacher_id: int = None):
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.teacher_id == teacher_id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    if title is not None:
        course.title = title
    if description is not None:
        course.description = description
    
    db.commit()
    db.refresh(course)
    return course

def delete_course(db: Session, course_id: int, teacher_id: int):
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.teacher_id == teacher_id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    db.delete(course)
    db.commit()
    return {"message": "Курс удален"}

def enroll_student(db: Session, course_id: int, student_username: str, teacher_id: int):
    # Проверяем что курс принадлежит учителю
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.teacher_id == teacher_id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    # Находим студента
    student = db.query(models.User).filter(
        models.User.username == student_username,
        models.User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Студент не найден")
    
    # Проверяем не записан ли уже студент
    existing_enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id,
        models.Enrollment.student_id == student.id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Студент уже записан на курс")
    
    # Создаем запись о записи на курс
    enrollment = models.Enrollment(
        student_id=student.id,
        course_id=course_id
    )
    
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    
    return enrollment

def get_course_enrollments(db: Session, course_id: int, teacher_id: int):
    # Проверяем что курс принадлежит учителю
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.teacher_id == teacher_id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    return db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id
    ).all()

def remove_student_from_course(db: Session, course_id: int, student_id: int, teacher_id: int):
    # Проверяем что курс принадлежит учителю
    course = db.query(models.Course).filter(
        models.Course.id == course_id,
        models.Course.teacher_id == teacher_id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    # Находим запись о записи на курс
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id,
        models.Enrollment.student_id == student_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Студент не записан на этот курс")
    
    db.delete(enrollment)
    db.commit()
    
    return {"message": "Студент удален из курса"}