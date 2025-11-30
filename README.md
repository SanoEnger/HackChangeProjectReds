# HackChangeProjectReds

Full‑stack веб‑приложение с разделением на backend и frontend. Репозиторий создан для разработки веб‑сервиса с API на Python и клиентской частью на JavaScript (React/Vite). [attached_file:1]

## Разработчики проекта

Команда Reds

Лайкин Влдаимир - Backend-разработчик

Смирнов Глеб - Frontend-разработчик

Волосников Александр - Fullstack-разработчик

## Содержание

- [О проекте](#о-проекте)
- [Стек технологий](#стек-технологий)
- [Структура репозитория](#структура-репозитория)
- [Установка и запуск](#установка-и-запуск)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Работа через Docker](#работа-через-docker)
- [Планы развития](#планы-развития)
- [Авторы](#авторы)
- [Лицензия](#лицензия)

## О проекте

HackChangeProjectReds — учебный/хакатонный проект, представляющий собой веб‑приложение с отдельным сервером и клиентом. Основная идея — продемонстрировать архитектуру разделённого приложения и возможность дальнейшего расширения бизнес‑логики и интерфейса. [attached_file:1]

## Стек технологий

- **Языки:** JavaScript, Python, CSS. [attached_file:1]  
- **Frontend:** React + Vite (SPA, сборка через Node.js/Yarn или npm). [attached_file:1]  
- **Backend:** Python, FastAPI/ASGI‑стек (структура каталога `backend` и `app` под API и модели). [attached_file:1]  
- **База данных:** SQLite (файл `app.db` в backend). [attached_file:1]  
- **Контейнеризация:** Dockerfile для backend (сборка образа и запуск API в контейнере). [attached_file:1]  

## Структура репозитория
- HackChangeProjectReds/
- backend/ # Серверная часть приложения
- frontend/ # Клиентская часть приложения


Папка `backend` содержит исходный код серверного приложения на Python, включая точку входа, работу с базой данных и описание API. Папка `frontend` содержит исходный код клиентского приложения на JavaScript (React/Vite) и все необходимые конфигурационные файлы. [attached_file:1]

## Установка и запуск

Перед началом убедитесь, что установлены:

- Git  
- Python (рекомендуется 3.10+), pip  
- Node.js и пакетный менеджер (Yarn или npm)  
- Опционально: Docker и docker‑compose для контейнеризации

### Backend

1. Клонировать репозиторий и перейти в папку backend:

   git clone https://github.com/SanoEnger/HackChangeProjectReds.git

   cd HackChangeProjectReds/backend

3. Создать и активировать виртуальное окружение (рекомендуется):

   python -m venv venv

   Linux/macOS
   source venv/bin/activate

   Windows
   venv\Scripts\activate

4. Установить зависимости (если есть файл `requirements.txt`):

   pip install -r requirements.txt

5. Запустить приложение (пример для Uvicorn/FastAPI):

   uvicorn app.main:app --reload

6. После запуска backend будет доступен по адресу:

  - API: `http://localhost:8000`
  - Документация (если включена): `http://localhost:8000/docs` или `http://localhost:8000/redoc`
  
### Frontend
1. Перейти в директорию frontend:
   
   cd ../frontend

3. Установить зависимости:

   yarn # или npm install

5. Запустить dev‑сервер Vite:

   yarn dev # или npm run dev

7. По умолчанию приложение будет доступно по адресу:

- Frontend: `http://localhost:5173` (порт можно изменить в настройках Vite)

5. При необходимости укажите URL backend‑API в переменных окружения Vite (например, `.env` / `.env.local`) и используйте его в коде frontend.
