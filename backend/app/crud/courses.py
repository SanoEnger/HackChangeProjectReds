from sqlalchemy.orm import Session
from .. import models

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
