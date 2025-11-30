from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, deps
from ..crud import courses

router = APIRouter()


@router.post("/courses", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(deps.DB), teacher=Depends(deps.CurrentTeacher)):
    return courses.create_course(db, course.title, course.description, teacher.id)


@router.get("/courses", response_model=list[schemas.CourseResponse])
def get_courses(db: Session = Depends(deps.DB), teacher=Depends(deps.CurrentTeacher)):
    return courses.get_courses_by_teacher(db, teacher.id)
