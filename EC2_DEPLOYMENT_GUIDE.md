# 🚀 GitHub & EC2 Deployment Guide

## 📋 Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Repository name: `NashaMukht`
4. Description: `Nasha Mukht Bharat RUN - WhatsApp Registration System`
5. Set to **Private** (recommended for production apps)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create NashaMukht --private --description "Nasha Mukht Bharat RUN - WhatsApp Registration System"
```

## 📤 Step 2: Push Code to GitHub

Run these commands in your NashaMukht directory:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/NashaMukht.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🖥️ Step 3: EC2 Deployment

### Prerequisites
- EC2 instance running Ubuntu/Amazon Linux
- SSH access to your EC2 instance
- Domain name (optional but recommended)

### EC2 Setup Commands

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install MySQL client (for database operations)
sudo apt install mysql-client -y

# Install Git
sudo apt install git -y
```

### Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www/nashamukht
sudo chown ubuntu:ubuntu /var/www/nashamukht
cd /var/www/nashamukht

# Clone your repository
git clone https://github.com/YOUR_USERNAME/NashaMukht.git .

# Install dependencies
npm install --production

# Create logs directory
mkdir logs
chmod 755 logs

# Create .env file
cp env.example .env
nano .env
```

### Configure Environment Variables

Edit the `.env` file with your production values:

```env
# Database Configuration
DB_HOST=bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com
DB_USER=shahzoor
DB_PASSWORD=S!12hahzoorali
DB_NAME=NashaMukht

# Server Configuration
PORT=3000
NODE_ENV=production

# Twilio Configuration (REQUIRED - Get from Twilio Console)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number

# Event Configuration
EVENT_NAME=Nasha Mukht Bharat RUN
EVENT_DATE=2025-11-14
EVENT_TIME=07:00
EVENT_LOCATION=Sanjeevaiah Park, Necklace Road, Hyderabad
EVENT_CONTACT_1=99635 52551
EVENT_CONTACT_2=93460 13569
EVENT_WEBSITE=www.wakeuphumanity.org

# Security
JWT_SECRET=your_jwt_secret_key_here
ADMIN_PASSWORD_HASH=your_admin_password_hash

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### Database Setup

```bash
# Connect to your database and create schema
mysql -h bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com -u shahzoor -p NashaMukht < database_schema.sql

# Verify database connection
node -e "
const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
pool.query('SELECT 1', (err) => {
    if (err) {
        console.log('Database test failed:', err.message);
        process.exit(1);
    } else {
        console.log('Database test passed');
        process.exit(0);
    }
});
"
```

### Start Application with PM2

```bash
# Start the application
pm2 start app.js --name "nasha-mukht-bot"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by PM2

# Check status
pm2 status
pm2 logs nasha-mukht-bot
```

### Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/nashamukht
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain

    # Admin panel
    location /admin.php {
        root /var/www/nashamukht;
        index admin.php;
        try_files $uri =404;
    }

    # API endpoints
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

Enable the site:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/nashamukht /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔧 Step 4: Twilio Configuration

1. **Login to Twilio Console**: [console.twilio.com](https://console.twilio.com)
2. **Navigate to WhatsApp**: Messaging → Try it out → Send a WhatsApp message
3. **Configure Webhook**:
   - Webhook URL: `https://your-domain.com/whatsapp/messages`
   - HTTP Method: POST
4. **Test the webhook**: Send a test message to verify it's working

## 🧪 Step 5: Testing

### Test Application Health
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test admin panel
curl http://your-domain.com/admin.php
```

### Test WhatsApp Bot
1. Send "hi" to your WhatsApp bot
2. Send your full name to register
3. Send "status" to check registration
4. Check admin panel for new registrations

## 📊 Step 6: Monitoring

### PM2 Monitoring
```bash
# View logs
pm2 logs nasha-mukht-bot

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart nasha-mukht-bot

# Stop application
pm2 stop nasha-mukht-bot
```

### System Monitoring
```bash
# Check system resources
htop

# Check disk space
df -h

# Check Nginx status
sudo systemctl status nginx

# Check application logs
tail -f /var/www/nashamukht/logs/combined.log
```

## 🔄 Step 7: Updates and Maintenance

### Updating Application
```bash
# Navigate to application directory
cd /var/www/nashamukht

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install --production

# Restart application
pm2 restart nasha-mukht-bot
```

### Database Backups
```bash
# Create backup script
nano /var/www/nashamukht/backup.sh
```

Add this content:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com -u shahzoor -p NashaMukht > /var/www/nashamukht/backups/nashamukht_backup_$DATE.sql
find /var/www/nashamukht/backups/ -name "*.sql" -mtime +7 -delete
```

```bash
# Make executable and setup cron
chmod +x /var/www/nashamukht/backup.sh
mkdir /var/www/nashamukht/backups

# Add to crontab for daily backups
crontab -e
# Add this line: 0 2 * * * /var/www/nashamukht/backup.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**:
   ```bash
   pm2 logs nasha-mukht-bot
   # Check for errors in logs
   ```

2. **Database connection failed**:
   ```bash
   # Test database connection
   mysql -h bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com -u shahzoor -p
   ```

3. **Nginx 502 error**:
   ```bash
   # Check if application is running
   pm2 status
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **WhatsApp webhook not working**:
   - Verify webhook URL in Twilio console
   - Check application logs for incoming requests
   - Test webhook with curl

## 📞 Support

If you encounter any issues:
1. Check application logs: `pm2 logs nasha-mukht-bot`
2. Check system logs: `sudo journalctl -u nginx`
3. Verify all environment variables are set correctly
4. Test database connectivity
5. Verify Twilio webhook configuration

---

**🎉 Your Nasha Mukht Bharat RUN WhatsApp Registration System is now live!**

**Admin Panel**: `https://your-domain.com/admin.php`
**Health Check**: `https://your-domain.com/health`
**WhatsApp Bot**: Send messages to your Twilio WhatsApp number
