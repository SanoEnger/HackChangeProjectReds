from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import auth_router, student_router, teacher_router, files_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Единая Веб-Платформа для Обучения")

app.mount("/app/files", StaticFiles(directory="app/files"), name="files")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(student_router.router, prefix="/student", tags=["Student"])
app.include_router(teacher_router.router, prefix="/teacher", tags=["Teacher"])
app.include_router(files_router.router, prefix="/files", tags=["Files"])


@app.get("/")
def root():
    return {"msg": "бэк работает!"}
