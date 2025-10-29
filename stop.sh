#!/bin/bash

# Nasha Mukht Bharat RUN - Stop Script
# This script safely stops the application and cleans up processes

set -e

echo "🛑 Stopping Nasha Mukht Bharat RUN WhatsApp Bot..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Cannot stop application properly."
    exit 1
fi

# Check if the application is running
if pm2 list | grep -q "nasha-mukht-bot"; then
    echo "⏹️  Stopping application with PM2..."
    pm2 stop nasha-mukht-bot
    pm2 delete nasha-mukht-bot
    echo "✅ Application stopped successfully"
else
    echo "ℹ️  Application is not running in PM2"
fi

# Kill any remaining processes on port 3000
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "🧹 Cleaning up processes on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo "✅ Port 3000 is now free"
else
    echo "ℹ️  Port 3000 is already free"
fi

# Show final status
echo "📊 Final Status:"
pm2 status

echo "✅ Nasha Mukht Bharat RUN WhatsApp Bot stopped successfully!"