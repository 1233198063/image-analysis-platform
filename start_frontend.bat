@echo off
echo Starting Frontend Server...
cd frontend

echo Installing Node.js dependencies...
npm install

echo Starting React development server...
set REACT_APP_API_URL=http://localhost:8000
npm start

pause