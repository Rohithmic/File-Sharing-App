#!/bin/bash
echo "Starting deployment..."
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Changing to client directory..."
cd client
echo "Client directory: $(pwd)"
echo "Listing client files:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Build complete. Listing dist directory:"
ls -la dist/ 