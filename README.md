# Smart Payroll & HR Management System

## Quick Start (New PC)

> **Prerequisites:** Python 3.10+, Node.js 18+, npm

### 1. Clone & Setup (one time)

```powershell
git clone <your-repo-url>
cd payrollsys
setup.bat
```

This will automatically:
- Create Python virtual environment
- Install backend & frontend dependencies
- Create SQLite database with all tables
- Create admin user (`admin` / `admin123`)

### 2. Run the App

```powershell
run.bat
```

- **Backend (Django):** http://127.0.0.1:8000
- **Frontend (React):** http://localhost:3000
- **Admin Panel:** http://127.0.0.1:8000/admin

---

## Using PostgreSQL (Optional)

By default SQLite is used (zero config). To use PostgreSQL instead:

1. Create a database called `payroll_db` in pgAdmin.
2. Set these environment variables before running:

```powershell
$env:USE_POSTGRES = "True"
$env:DB_NAME = "payroll_db"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "your_password"
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
```

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
