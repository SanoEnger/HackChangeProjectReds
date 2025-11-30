from sqlalchemy.orm import Session
from .. import models

def create_lecture(db: Session, title: str, content: str, file_path: str, course_id: int):
    lecture = models.Lecture(title=title, content=content, file_path=file_path, course_id=course_id)
    db.add(lecture)
    db.commit()
    db.refresh(lecture)
    return lecture

def get_lectures_by_course(db: Session, course_id: int):
    return db.query(models.Lecture).filter(models.Lecture.course_id == course_id).all()
