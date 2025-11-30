from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import schemas, auth, deps, models
from ..crud import users
import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()

# РЕГИСТРАЦИЯ
@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    # Проверяем существование пользователя
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    
    # ДЕТАЛЬНОЕ ЛОГИРОВАНИЕ
    print(f"🔐 REGISTER REQUEST RECEIVED:")
    print(f"   Username: {user.username}")
    print(f"   Password length: {len(user.password)}")
    print(f"   Role from frontend: {user.role}")
    print(f"   Role type: {type(user.role)}")
    
    # Валидация роли
    allowed_roles = ['student', 'teacher']
    if user.role not in allowed_roles:
        print(f"❌ INVALID ROLE: {user.role}")
        raise HTTPException(
            status_code=400, 
            detail=f"Недопустимая роль. Допустимые роли: {allowed_roles}"
        )
    
    # Создаем пользователя с ВЫБРАННОЙ ролью
    password_hash = auth.hash_password(user.password)
    new_user = models.User(
        username=user.username, 
        password_hash=password_hash, 
        role=user.role  # Используем выбранную роль
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print(f"✅ USER CREATED SUCCESSFULLY:")
    print(f"   ID: {new_user.id}")
    print(f"   Username: {new_user.username}") 
    print(f"   Role in database: {new_user.role}")
    
    return new_user

# ЛОГИН
@router.post("/login")
def login(login_data: schemas.UserLogin, db: Session = Depends(deps.get_db)):
    user = users.get_user_by_username(db, login_data.username)
    if not user or not auth.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверные учетные данные",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Создаем токен с ID пользователя
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    
    print(f"✅ LOGIN SUCCESSFUL:")
    print(f"   User ID: {user.id}")
    print(f"   Username: {user.username}")
    print(f"   Role: {user.role}")
    print(f"   Token created for user ID: {user.id}")
    
    return {"access_token": access_token, "token_type": "bearer"}

# ПОЛУЧЕНИЕ ДАННЫХ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(deps.get_current_user)):
    print(f"🔍 /me endpoint called for user: {current_user.username}")
    print(f"   User ID: {current_user.id}")
    print(f"   User Role: {current_user.role}")
    
    return current_user

# ДОПОЛНИТЕЛЬНО: эндпоинт для проверки работы аутентификации
@router.get("/test-auth")
def test_auth(current_user: models.User = Depends(deps.get_current_user)):
    return {
        "message": "Auth is working!",
        "user_id": current_user.id,
        "username": current_user.username,
        "role": current_user.role
    }