from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from .. import schemas, deps
from ..crud import courses, lectures, assignments
import shutil
import uuid
from pathlib import Path
router = APIRouter()

@router.post("/courses", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(deps.DB), teacher=Depends(deps.CurrentTeacher)):
    return courses.create_course(db, course.title, course.description, teacher.id)

@router.get("/courses", response_model=list[schemas.CourseResponse])
def get_courses(db: Session = Depends(deps.DB), teacher=Depends(deps.CurrentTeacher)):
    return courses.get_courses_by_teacher(db, teacher.id)

@router.put("/courses/{course_id}", response_model=schemas.CourseResponse)
def update_course(
    course_id: int,
    course_update: schemas.CourseUpdate,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    return courses.update_course(
        db, 
        course_id, 
        course_update.title, 
        course_update.description, 
        teacher.id
    )

@router.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    return courses.delete_course(db, course_id, teacher.id)

@router.post("/courses/{course_id}/enroll", response_model=schemas.EnrollmentResponse)
def enroll_student(
    course_id: int,
    enrollment: schemas.EnrollmentCreate,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    return courses.enroll_student(db, course_id, enrollment.student_username, teacher.id)

@router.get("/courses/{course_id}/enrollments", response_model=list[schemas.EnrollmentResponse])
def get_course_enrollments(
    course_id: int,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    return courses.get_course_enrollments(db, course_id, teacher.id)

@router.delete("/courses/{course_id}/students/{student_id}")
def remove_student_from_course(
    course_id: int,
    student_id: int,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    return courses.remove_student_from_course(db, course_id, student_id, teacher.id)

# ЛЕКЦИИ
@router.post("/courses/{course_id}/lectures", response_model=schemas.LectureResponse)
def create_lecture(
    course_id: int,
    title: str = Form(...),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    # Проверяем что курс принадлежит учителю
    course = courses.get_course(db, course_id)
    if not course or course.teacher_id != teacher.id:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    file_path = None
    if file:
        # Сохраняем файл
        file_extension = file.filename.split('.')[-1]
        filename = f"lecture_{uuid.uuid4()}.{file_extension}"
        lectures_dir = Path("app/files/lectures")
        lectures_dir.mkdir(parents=True, exist_ok=True)
        file_path = lectures_dir / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_path = str(file_path)
    
    return lectures.create_lecture(db, title, content, file_path, course_id)

@router.get("/courses/{course_id}/lectures", response_model=list[schemas.LectureResponse])
def get_course_lectures(
    course_id: int,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    course = courses.get_course(db, course_id)
    if not course or course.teacher_id != teacher.id:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    return lectures.get_lectures_by_course(db, course_id)

# ЗАДАНИЯ
@router.post("/courses/{course_id}/assignments", response_model=schemas.AssignmentResponse)
def create_assignment(
    course_id: int,
    assignment: schemas.AssignmentCreate,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    course = courses.get_course(db, course_id)
    if not course or course.teacher_id != teacher.id:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    return assignments.create_assignment(db, assignment.title, assignment.description, course_id)

@router.get("/courses/{course_id}/assignments", response_model=list[schemas.AssignmentResponse])
def get_course_assignments(
    course_id: int,
    db: Session = Depends(deps.DB),
    teacher=Depends(deps.CurrentTeacher)
):
    course = courses.get_course(db, course_id)
    if not course or course.teacher_id != teacher.id:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    assignments_list = assignments.get_assignments_by_course(db, course_id)
    # Добавляем количество submissions для каждого задания
    for assignment in assignments_list:
        assignment.submissions_count = len(assignment.submissions)
    
    return assignments_list