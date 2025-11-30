from pydantic import BaseModel, field_validator
from typing import Optional, List


class UserBase(BaseModel):
    username: str


class UserCreate(BaseModel):
    username: str
    password: str
    role: str

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        allowed_roles = ['student', 'teacher']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {allowed_roles}')
        return v

    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v):
        byte_length = len(v.encode('utf-8'))
        if byte_length > 72:
            raise ValueError(f'Password too long: {byte_length} bytes (max 72)')
        if byte_length < 6:
            raise ValueError('Password too short (min 6 bytes)')
        return v
    

class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True



class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int
    teacher_id: int

    class Config:
        from_attributes = True




class LectureBase(BaseModel):
    title: str
    content: Optional[str] = None


class LectureCreate(LectureBase):
    pass


class LectureResponse(LectureBase):
    id: int
    file_path: Optional[str]

    class Config:
        from_attributes = True




class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentResponse(AssignmentBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True




class SubmissionCreate(BaseModel):
    answer_text: Optional[str] = None


class SubmissionResponse(BaseModel):
    id: int
    student_id: int
    assignment_id: int
    answer_text: Optional[str]
    file_path: Optional[str]

    class Config:
        from_attributes = True




class GradeCreate(BaseModel):
    value: int
    feedback: Optional[str]


class GradeResponse(BaseModel):
    id: int
    submission_id: int
    value: int
    feedback: Optional[str]

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str