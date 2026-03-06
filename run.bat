@echo off
echo ============================================
echo   Smart Payroll - Starting Servers
echo ============================================
echo.

REM Start Backend in a new window
echo Starting Django backend on http://127.0.0.1:8000 ...
start "Payroll Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python manage.py runserver"

REM Start Frontend in a new window
echo Starting React frontend on http://localhost:3000 ...
start "Payroll Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both servers are starting in separate windows.
echo Close this window or press any key to exit.
pause
