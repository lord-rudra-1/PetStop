#!/bin/bash

# Install dependencies for main project
echo "Installing root dependencies..."
npm install

# Install dependencies for frontend
echo "Installing frontend dependencies..."
cd frontend && npm install && npm run build
cd ..

# Install dependencies for backend
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

echo "Build complete!" 