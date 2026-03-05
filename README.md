# Smart Payroll & HR Management System

## Quick Start

### 1. Backend (Django)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

- Admin: http://127.0.0.1:8000/admin
- API: http://127.0.0.1:8000/api/

**Login:** `admin` / `admin123`

### 2. Frontend (React)

```powershell
cd frontend
npm install
npm start
```

- App: http://localhost:3000

### 3. Database

PostgreSQL required. Create database `payroll_db` in pgAdmin.  
Update `backend/hr_system/settings.py` if your PostgreSQL port/password differs.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login/` | POST | JWT login |
| `/api/auth/refresh/` | POST | Refresh token |
| `/api/accounts/me/` | GET | Current user |
| `/api/employees/` | GET, POST | Employees CRUD |
| `/api/attendance/` | GET, POST | Attendance |
| `/api/leave/` | GET, POST | Leave management |
| `/api/payroll/` | GET, POST | Payroll |
| `/api/dashboard/summary/` | GET | Dashboard stats |
