@echo off
echo ============================================
echo   Smart Payroll - One-Time Setup
echo ============================================
echo.

REM ---- Backend Setup ----
echo [1/5] Creating Python virtual environment...
cd /d "%~dp0backend"
if not exist "venv" (
    python -m venv venv
)

echo [2/5] Installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo [3/5] Running database migrations...
python manage.py migrate

echo [4/5] Creating admin user...
python create_admin.py

call deactivate

REM ---- Frontend Setup ----
echo [5/5] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install

echo.
echo ============================================
echo   Setup Complete!
echo   Run 'run.bat' to start the application.
echo ============================================
pause
