from fastapi import Depends
from .auth import (
    get_current_user,
    get_current_student,
    get_current_teacher,
    get_db
)

CurrentUser = get_current_user
CurrentStudent = get_current_student
CurrentTeacher = get_current_teacher
DB = get_db
