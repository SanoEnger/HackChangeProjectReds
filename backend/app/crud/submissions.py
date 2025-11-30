from sqlalchemy.orm import Session
from .. import models

def create_submission(db: Session, student_id: int, assignment_id: int, answer_text: str = None, file_path: str = None):
    submission = models.Submission(
        student_id=student_id,
        assignment_id=assignment_id,
        answer_text=answer_text,
        file_path=file_path
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

def get_submissions_by_assignment(db: Session, assignment_id: int):
    return db.query(models.Submission).filter(models.Submission.assignment_id == assignment_id).all()
