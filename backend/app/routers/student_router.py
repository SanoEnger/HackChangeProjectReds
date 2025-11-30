from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, deps
from ..crud import courses, lectures, assignments

router = APIRouter()

@router.get("/courses", response_model=list[schemas.CourseResponse])
def get_all_courses(db: Session = Depends(deps.DB), student=Depends(deps.CurrentStudent)):
    courses_list = db.query(models.Course).all()
    return courses_list

@router.get("/my-courses", response_model=list[schemas.CourseResponse])
def get_my_courses(db: Session = Depends(deps.DB), student=Depends(deps.CurrentStudent)):
    # Курсы, на которые записан студент
    enrollments = db.query(models.Enrollment).filter(models.Enrollment.student_id == student.id).all()
    course_ids = [enrollment.course_id for enrollment in enrollments]
    my_courses = db.query(models.Course).filter(models.Course.id.in_(course_ids)).all()
    return my_courses

@router.post("/courses/{course_id}/enroll")
def enroll_in_course(
    course_id: int,
    db: Session = Depends(deps.DB),
    student=Depends(deps.CurrentStudent)
):
    # Проверяем существует ли курс
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    # Проверяем не записан ли уже
    existing_enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id,
        models.Enrollment.student_id == student.id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Вы уже записаны на этот курс")
    
    # Записываем на курс
    enrollment = models.Enrollment(
        student_id=student.id,
        course_id=course_id
    )
    
    db.add(enrollment)
    db.commit()
    
    return {"message": "Вы успешно записаны на курс"}

@router.get("/courses/{course_id}/lectures", response_model=list[schemas.LectureResponse])
def get_course_lectures(
    course_id: int,
    db: Session = Depends(deps.DB),
    student=Depends(deps.CurrentStudent)
):
    # Проверяем что студент записан на курс
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id,
        models.Enrollment.student_id == student.id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=403, detail="Вы не записаны на этот курс")
    
    return lectures.get_lectures_by_course(db, course_id)

@router.get("/courses/{course_id}/assignments", response_model=list[schemas.AssignmentResponse])
def get_course_assignments(
    course_id: int,
    db: Session = Depends(deps.DB),
    student=Depends(deps.CurrentStudent)
):
    # Проверяем что студент записан на курс
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id,
        models.Enrollment.student_id == student.id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=403, detail="Вы не записаны на этот курс")
    
    assignments_list = assignments.get_assignments_by_course(db, course_id)
    return assignments_list

@router.get("/courses/{course_id}")
def get_course_detail(
    course_id: int,
    db: Session = Depends(deps.DB),
    student=Depends(deps.CurrentStudent)
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    
    # Проверяем записан ли студент
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.course_id == course_id,
        models.Enrollment.student_id == student.id
    ).first()
    
    is_enrolled = enrollment is not None
    
    # Получаем имя преподавателя
    teacher = db.query(models.User).filter(models.User.id == course.teacher_id).first()
    teacher_name = teacher.username if teacher else f"ID {course.teacher_id}"
    
    return {
        **schemas.CourseResponse.from_orm(course).dict(),
        "is_enrolled": is_enrolled,
        "teacher_name": teacher_name
    }