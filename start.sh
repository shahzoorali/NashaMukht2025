#!/bin/bash

# Nasha Mukht Bharat RUN - Startup Script
# This script handles process management and port conflicts

set -e

echo "🏃‍♂️ Starting Nasha Mukht Bharat RUN WhatsApp Bot..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
fi

# Check if the application is already running
if pm2 list | grep -q "nasha-mukht-bot"; then
    echo "⚠️  Application is already running. Stopping existing instance..."
    pm2 stop nasha-mukht-bot
    pm2 delete nasha-mukht-bot
fi

# Check for processes using port 3000
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Killing existing processes..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit .env file with your configuration"
    else
        echo "❌ .env.example not found. Please create .env file manually"
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Show status
echo "📊 Application Status:"
pm2 status

echo "✅ Nasha Mukht Bharat RUN WhatsApp Bot started successfully!"
echo "📝 View logs with: pm2 logs nasha-mukht-bot"
echo "🔄 Restart with: pm2 restart nasha-mukht-bot"
echo "⏹️  Stop with: pm2 stop nasha-mukht-bot"