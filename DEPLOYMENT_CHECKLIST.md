# NashaMukht Project - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Database Setup
- [ ] Database `NashaMukht` created on AWS RDS
- [ ] Database schema imported (`database_schema.sql`)
- [ ] Database connection tested
- [ ] Initial event data inserted

### ✅ Environment Configuration
- [ ] `.env` file created with correct credentials
- [ ] Twilio credentials configured
- [ ] Database credentials verified
- [ ] Event details updated

### ✅ Twilio Setup
- [ ] Twilio account created
- [ ] WhatsApp Sandbox enabled OR Business API access
- [ ] Webhook URL configured: `https://yourdomain.com/whatsapp/messages`
- [ ] Test messages sent successfully

### ✅ Server Setup
- [ ] Node.js installed (v14+)
- [ ] Dependencies installed (`npm install`)
- [ ] Logs directory created
- [ ] Application tested locally

### ✅ Security
- [ ] Environment variables secured
- [ ] Database credentials not hardcoded
- [ ] Rate limiting configured
- [ ] Input validation enabled

## Deployment Steps

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Application Deployment
```bash
# Upload project files to server
# Set proper permissions
chmod +x app.js

# Install dependencies
npm install --production

# Create logs directory
mkdir logs
chmod 755 logs
```

### 3. Environment Setup
```bash
# Create .env file with production values
# Ensure all credentials are correct
# Test database connection
```

### 4. Start Application
```bash
# Start with PM2
pm2 start app.js --name "nasha-mukht-bot"

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs nasha-mukht-bot
```

### 5. Web Server Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
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
    }
}
```

### 6. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Post-Deployment Testing

### ✅ Functionality Tests
- [ ] Health check endpoint: `https://yourdomain.com/health`
- [ ] Admin panel accessible: `https://yourdomain.com/admin.php`
- [ ] WhatsApp webhook responding
- [ ] Database operations working
- [ ] Logs being generated

### ✅ WhatsApp Bot Tests
- [ ] Send "hi" to bot → Should get event info
- [ ] Send full name → Should register successfully
- [ ] Send "status" → Should show registration details
- [ ] Send "info" → Should show event information
- [ ] Send "change name" → Should prompt for new name

### ✅ Admin Panel Tests
- [ ] Statistics displaying correctly
- [ ] Recent registrations showing
- [ ] All participants table loading
- [ ] Auto-refresh working
- [ ] Responsive design on mobile

## Monitoring & Maintenance

### Daily Checks
- [ ] Check application logs for errors
- [ ] Verify database connectivity
- [ ] Monitor registration numbers
- [ ] Check Twilio webhook status

### Weekly Checks
- [ ] Review error logs
- [ ] Check disk space
- [ ] Update dependencies if needed
- [ ] Backup database

### Monthly Checks
- [ ] Review performance metrics
- [ ] Update security patches
- [ ] Review and rotate logs
- [ ] Test disaster recovery procedures

## Emergency Contacts

- **Technical Support**: [Your contact]
- **Database Issues**: AWS RDS Support
- **Twilio Issues**: Twilio Support
- **Server Issues**: [Your hosting provider]

## Backup Procedures

### Database Backup
```bash
# Daily automated backup
mysqldump -h bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com -u shahzoor -p NashaMukht > backup_$(date +%Y%m%d).sql
```

### Application Backup
```bash
# Backup application files
tar -czf nashamukht_backup_$(date +%Y%m%d).tar.gz /path/to/NashaMukht/
```

## Rollback Plan

If issues occur:

1. **Stop current application**: `pm2 stop nasha-mukht-bot`
2. **Restore from backup**: Restore previous version
3. **Restart application**: `pm2 start app.js --name "nasha-mukht-bot"`
4. **Verify functionality**: Test all endpoints
5. **Monitor logs**: Check for any errors

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
