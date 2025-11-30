from sqlalchemy.orm import Session
from .. import models

def create_grade(db: Session, submission_id: int, value: int, feedback: str = None):
    grade = models.Grade(submission_id=submission_id, value=value, feedback=feedback)
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade

def get_grade_by_submission(db: Session, submission_id: int):
    return db.query(models.Grade).filter(models.Grade.submission_id == submission_id).first()
