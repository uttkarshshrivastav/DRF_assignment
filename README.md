# Creative Workflow System: DRF_assignment(Team 5)



A high-performance, full-stack workspace designed to streamline project management, task tracking, and team communication. Built with a decoupled architecture using Django REST Framework for a robust API and React/Vite for a lightning-fast, reactive user interface.

## Core Features

* **Role-Based Access Control:** Secure user registration, authentication, and role management.
* **Project & Task Engine:** Create projects, assign team members, and track granular task progress through customizable stages.
* **Task Versioning & Media:** Track task version history and attach completion images/media to specific tasks.
* **Real-Time Communication:** Persistent, low-latency WebSocket chat rooms dedicated to individual projects and live task comments.
* **Asynchronous Processing:** Background task execution and scheduled events managed via Celery and Redis.
* **Live Notifications:** Real-time alert system for deadlines, mentions, and project updates.

---

## Tech Stack

**Frontend (Client)**
* **Core:** React
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS, DaisyUI
* **Network:** Axios

**Backend (API & WebSockets)**
* **Core:** Python, Django, Django REST Framework
* **Async Server:** Daphne (ASGI)
* **Database:** PostgreSQL
* **Message Broker & Cache:** Redis
* **Task Queue:** Celery

---

## Local Development Setup

### Prerequisites
* **Python**
* **Node.js**
* **Redis**

### 1. Backend Initialization

Open your terminal and navigate to the root directory.

**Environment Variables**
Create a `.env` file in the `/` directory using this template:

    REDIS_URL=
    SECRET_KEY=
    ADMIN_ACCESS_CODE=
    DATABASE_URL=
    CELERY_RESULT_BACKEND=
    CELERY_BROKER_URL=   

**Python Dependencies**
Ensure your `requirements.txt` file in the root directory includes:

    Django
    djangorestframework
    djangorestframework-simplejwt
    django-cors-headers
    channels
    daphne
    celery
    redis
    python-decouple
    dj-database-url

**Setup Commands**
Run the following commands to initialize the backend:

    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser

### 2. Frontend Initialization

Open a new terminal tab and navigate to the frontend directory.

    cd frontend
    npm install

---

## Running the Application

To run the full stack locally, you will need **three active terminal tabs**. 

**Terminal 1: Django Backend**

    python manage.py runserver

**Terminal 2: Celery Worker**

    celery -A config worker -l info --pool=solo

**Terminal 3: React Frontend**

    cd frontend
    npm run dev

---
##video Drive Link
https://drive.google.com/drive/folders/15chVjsG1TuaCWf8vrbZQA_bcNd6WZBs5

## System Architecture (Models)

* **Users:** Core authentication and profile management.
* **Projects:** Parent containers for team workflows.
* **Tasks:** Actionable items with assignees, deadlines, and completion statuses.
* **Versions & Images:** Historical tracking of task updates and media file references.
* **Comments:** Live discussion threads attached directly to tasks.
* **Chat Messages:** Volatile real-time data strictly for project rooms.
* **Notifications:** System-generated alerts tied to user instances.
