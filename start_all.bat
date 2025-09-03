@echo off
echo Starting Image Analysis Platform...
echo.

echo [1/2] Starting Backend Server in new window...
start "Backend Server" cmd /k "cd backend && pip install -r requirements.txt && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak >nul

echo [2/2] Starting Frontend Server in new window...
start "Frontend Server" cmd /k "cd frontend && set REACT_APP_API_URL=http://localhost:8000 && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3001
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to close this window...
pause >nul