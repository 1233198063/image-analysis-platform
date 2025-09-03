@echo off
echo 🎨 Business Image Analysis Platform - Full Stack Startup
echo ============================================================

echo.
echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python start.py"

echo.
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm start"

echo.
echo ✅ Both servers are starting...
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:8000
echo 📖 API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul