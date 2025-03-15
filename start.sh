#!/bin/bash

# Kill any existing processes
pkill -f "dotnet run" || true

# Navigate to backend and start .NET server
echo "Starting backend..."
cd backend
dotnet run &

# Navigate to frontend and start React server
cd ../frontend
echo "Starting frontend..."
npm run dev &

# Keep the script running
wait