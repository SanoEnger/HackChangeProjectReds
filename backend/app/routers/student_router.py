from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, deps

router = APIRouter()


@router.get("/courses", response_model=list[schemas.CourseResponse])
def get_my_courses(db: Session = Depends(deps.DB), student=Depends(deps.CurrentStudent)):
    
    courses = db.query(models.Course).all()
    return courses


@router.get("/courses/{course_id}", response_model=schemas.CourseResponse)
def get_course_detail(course_id: int, db: Session = Depends(deps.DB), student=Depends(deps.CurrentStudent)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    return course
