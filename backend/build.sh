#!/bin/bash
# Build frontend and copy to backend/public for production deployment
set -e

echo "Installing backend dependencies..."
npm install

echo "Installing frontend dependencies..."
cd .. && npm install

echo "Building frontend..."
VITE_BASE_URL="" npm run build -- 2>&1 || npx vite build

echo "Copying frontend build to backend/public..."
rm -rf backend/public
cp -r dist backend/public

echo "Build complete! Frontend served from backend/public/"
