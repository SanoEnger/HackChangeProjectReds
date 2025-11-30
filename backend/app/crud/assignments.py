from sqlalchemy.orm import Session
from .. import models

def create_assignment(db: Session, title: str, description: str, course_id: int):
    assignment = models.Assignment(title=title, description=description, course_id=course_id)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

def get_assignments_by_course(db: Session, course_id: int):
    return db.query(models.Assignment).filter(models.Assignment.course_id == course_id).all()
