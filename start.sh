#!/bin/bash

echo "🎨 Business Image Analysis Platform - Full Stack Startup"
echo "============================================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Python
if ! command_exists python3; then
    echo "❌ Python 3 is required but not found"
    exit 1
fi

# Check Node.js
if ! command_exists node; then
    echo "❌ Node.js is required but not found"
    exit 1
fi

# Check npm
if ! command_exists npm; then
    echo "❌ npm is required but not found"
    exit 1
fi

echo "✅ All required tools found"
echo ""

# Start backend in background
echo "🔧 Starting Backend Server..."
cd backend
python3 start.py &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend
echo "🌐 Starting Frontend Development Server..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are running!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "👋 All servers stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Wait for user input
wait