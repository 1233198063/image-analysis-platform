@echo off
echo Starting Backend Server...
cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo Starting FastAPI server...
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause