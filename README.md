# 🏃‍♂️ Nasha Mukht Bharat RUN - WhatsApp Registration System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com/)
[![Twilio](https://img.shields.io/badge/Twilio-WhatsApp-red.svg)](https://twilio.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive WhatsApp-based registration system for the **Nasha Mukht Bharat RUN** event, promoting a drug-free India through technology.

## 📅 Event Information

| Detail | Information |
|--------|-------------|
| **Event Name** | Nasha Mukht Bharat RUN |
| **Date** | 14th November 2025 (Friday) |
| **Time** | 7:00 AM – 9:00 AM |
| **Location** | Sanjeevaiah Park, Necklace Road, Hyderabad |
| **Chief Guest** | Shri V.C. Sajjanar, IPS, Commissioner of Police, Hyderabad |
| **Contact** | 99635 52551 \| 93460 13569 |
| **Website** | [www.wakeuphumanity.org](https://www.wakeuphumanity.org) |
| **Organization** | Wakeup Humanity Organization |

## 🎯 Project Overview

This project provides a complete WhatsApp-based registration system for marathon events, specifically designed for the Nasha Mukht Bharat RUN. It enables participants to register, manage their information, and receive event updates through WhatsApp messages, making event registration accessible to everyone with a smartphone.

### 🌟 Key Highlights

- **📱 WhatsApp-First Design**: Leverages WhatsApp's popularity in India for maximum accessibility
- **🤖 Intelligent Bot**: Handles registration, status checks, and information requests automatically
- **📊 Real-time Analytics**: Live dashboard with registration statistics and participant management
- **🔒 Production-Ready**: Built with security, scalability, and reliability in mind
- **🌐 Multi-platform**: Works on any device with WhatsApp access

## 🚀 Features

### Core Functionality
- ✅ **WhatsApp Registration**: Simple text-based registration process
- ✅ **Profile Name Capture**: Automatically captures WhatsApp profile names
- ✅ **Status Management**: Users can check registration status and update information
- ✅ **Event Information**: Instant access to event details and updates
- ✅ **Name Updates**: Participants can change their registered names

### Admin Features
- 📊 **Real-time Dashboard**: Live statistics and participant monitoring
- 📋 **Participant Management**: View, search, and manage all registrations
- 📈 **Analytics**: Registration trends and demographic insights
- 🔄 **Auto-refresh**: Real-time updates without manual refresh
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

### Technical Features
- 🛡️ **Security**: Rate limiting, input validation, and SQL injection protection
- 📝 **Logging**: Comprehensive logging with Winston for debugging and monitoring
- 🔄 **Error Handling**: Robust error handling with retry mechanisms
- 🏥 **Health Monitoring**: Health check endpoints for system monitoring
- 🔧 **Environment Management**: Secure configuration with environment variables

## 🛠️ Tech Stack

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** - Web application framework
- **Twilio** - WhatsApp API integration
- **Winston** - Logging framework
- **MySQL2** - Database driver

### Database
- **MySQL** (AWS RDS) - Primary database
- **Connection Pooling** - Optimized database connections
- **Migrations** - Database schema management

### Frontend
- **PHP** - Admin dashboard
- **HTML5/CSS3** - Responsive design
- **JavaScript** - Interactive features
- **Bootstrap** - UI framework (implied)

### DevOps & Deployment
- **PM2** - Process management
- **Nginx** - Reverse proxy and web server
- **Let's Encrypt** - SSL certificates
- **AWS EC2** - Cloud hosting
- **GitHub** - Version control

## 📋 Prerequisites

### System Requirements
- **Node.js** v14 or higher
- **MySQL** database (AWS RDS recommended)
- **PHP** 7.4+ (for admin panel)
- **Git** (for version control)

### Service Requirements
- **Twilio Account** with WhatsApp API access
- **AWS RDS** MySQL instance
- **EC2 Instance** (Ubuntu/Amazon Linux)
- **Domain Name** (optional but recommended)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shahzoorali/NashaMukht2025.git
cd NashaMukht2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Fresh Installation
```bash
# Create database and import schema
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p YOUR_DB_NAME < database_schema.sql
```

#### Option B: Existing Database Migration
```bash
# Add WhatsApp profile name support to existing database
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p YOUR_DB_NAME < migration_add_whatsapp_profile.sql
```

### 4. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit with your configuration
nano .env
```

#### Required Environment Variables

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Twilio Configuration (REQUIRED)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number

# Server Configuration
PORT=3000
NODE_ENV=production

# Event Configuration
EVENT_NAME=Nasha Mukht Bharat RUN
EVENT_DATE=2025-11-14
EVENT_TIME=07:00
EVENT_LOCATION=Sanjeevaiah Park, Necklace Road, Hyderabad
EVENT_CONTACT_1=99635 52551
EVENT_CONTACT_2=93460 13569
EVENT_WEBSITE=www.wakeuphumanity.org
```

### 5. Twilio Setup

1. **Create Twilio Account**: [console.twilio.com](https://console.twilio.com)
2. **Enable WhatsApp Sandbox** or get Business API access
3. **Configure Webhook**: Set webhook URL to `https://yourdomain.com/whatsapp/messages`
4. **Test Connection**: Send test messages to verify setup

### 6. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📱 WhatsApp Bot Usage

### User Commands

| Command | Description | Example |
|---------|-------------|---------|
| `hi`, `hello`, `start` | Start registration process | Send: `hi` |
| `[Full Name]` | Complete registration | Send: `John Doe` |
| `info` | Get event information | Send: `info` |
| `status` | Check registration status | Send: `status` |
| `change name` | Update registered name | Send: `change name` |

### User Journey Example

```
User: "hi"
Bot: "🏃‍♂️ Welcome to Nasha Mukht Bharat RUN! 🏃‍♀️
     Event details...
     To register, please reply with your FULL NAME."

User: "Rajesh Kumar"
Bot: "🎉 Thank you Rajesh Kumar! You are successfully registered!
     Your Registration ID: 123
     Event details...
     Commands: 'Info', 'Status', 'Change Name'"

User: "status"
Bot: "✅ You are already registered!
     Registration ID: 123
     Name: Rajesh Kumar
     Registration Date: 27 Oct 2025, 14:30
     Event details..."
```

## 🗄️ Database Schema

### Main Tables

#### `participants`
```sql
CREATE TABLE participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    whatsapp_profile_name VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    age INT NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    emergency_contact VARCHAR(20) NULL,
    emergency_contact_name VARCHAR(100) NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'awaiting_name_change', 'cancelled', 'completed') DEFAULT 'active',
    registration_source ENUM('whatsapp', 'website', 'manual') DEFAULT 'whatsapp',
    event_id INT DEFAULT 1,
    tshirt_size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL') NULL,
    medical_conditions TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Other Tables
- **`events`** - Event information and management
- **`message_logs`** - Complete WhatsApp interaction history
- **`admin_users`** - Admin panel access control
- **`event_stats`** - Analytics and statistics

## 🚦 API Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/whatsapp/messages` | POST | Main WhatsApp webhook | Twilio |
| `/whatsapp/fallback` | POST | Fallback for failed messages | Twilio |
| `/health` | GET | Health check endpoint | None |
| `/admin.php` | GET | Admin dashboard | None |

### Webhook Payload Example

```json
{
  "From": "whatsapp:+919876543210",
  "To": "whatsapp:+14155238886",
  "Body": "John Doe",
  "ProfileName": "John 🏃‍♂️",
  "MessageSid": "SM1234567890abcdef"
}
```

## 🚀 Deployment

### Quick Deploy to EC2

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx mysql-client git
sudo npm install -g pm2

# Clone and setup
cd /var/www
sudo mkdir nashamukht && sudo chown ubuntu:ubuntu nashamukht
cd nashamukht
git clone https://github.com/shahzoorali/NashaMukht2025.git .
npm install --production

# Configure environment
cp env.example .env
nano .env  # Add your production values

# Setup database
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p YOUR_DB_NAME < database_schema.sql

# Start application
pm2 start app.js --name "nasha-mukht-bot"
pm2 save
pm2 startup
```

### Detailed Deployment Guide

For comprehensive deployment instructions, see:
- [EC2_DEPLOYMENT_GUIDE.md](EC2_DEPLOYMENT_GUIDE.md) - Complete EC2 setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist

## 📊 Admin Dashboard

Access the admin dashboard at: `https://yourdomain.com/admin.php`

### Dashboard Features
- **📈 Real-time Statistics**: Total registrations, active participants, demographics
- **📋 Recent Registrations**: Latest 20 registrations with details
- **👥 All Participants**: Complete participant list with search and filter
- **📱 WhatsApp Profile Names**: Display both registered names and WhatsApp profiles
- **🔄 Auto-refresh**: Updates every 30 seconds
- **📱 Responsive Design**: Works on all devices

### Dashboard Screenshots
*[Screenshots would be added here in production]*

## 🧪 Testing

### Test Scenarios

Run comprehensive tests using the provided test scenarios:

```bash
# Run test scenarios
node test_scenarios.js

# Manual testing
curl http://localhost:3000/health
curl http://yourdomain.com/admin.php
```

### Test Coverage
- ✅ User registration flow
- ✅ Status checking
- ✅ Name updates
- ✅ Error handling
- ✅ Database operations
- ✅ Admin panel functionality

For detailed testing procedures, see [TEST_SCENARIOS.md](TEST_SCENARIOS.md).

## 📈 Monitoring & Analytics

### Application Monitoring
- **PM2 Process Manager**: Automatic restarts and monitoring
- **Winston Logging**: Structured logging with different levels
- **Health Checks**: Regular health endpoint monitoring
- **Error Tracking**: Comprehensive error logging and alerting

### Analytics Available
- Registration trends over time
- Geographic distribution (if phone numbers include area codes)
- Gender demographics
- Registration source tracking
- Message interaction patterns

## 🔒 Security Features

### Data Protection
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: All inputs sanitized and validated
- **SQL Injection Protection**: Prepared statements used throughout
- **Rate Limiting**: Protection against spam and abuse

### Access Control
- **Admin Panel**: Secure access to participant data
- **Database Security**: Encrypted connections to AWS RDS
- **Webhook Security**: Twilio signature verification

## 🐛 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs nasha-mukht-bot

# Check environment variables
cat .env

# Test database connection
node -e "console.log(process.env.DB_HOST)"
```

#### Database Connection Failed
```bash
# Test database connectivity
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p

# Check database exists
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p -e "SHOW DATABASES;"
```

#### WhatsApp Messages Not Received
- Verify Twilio webhook URL in console
- Check application logs for incoming requests
- Test webhook with curl: `curl -X POST https://yourdomain.com/whatsapp/messages`

### Log Locations
- **Application Logs**: `logs/combined.log`
- **Error Logs**: `logs/error.log`
- **PM2 Logs**: `pm2 logs nasha-mukht-bot`
- **Nginx Logs**: `/var/log/nginx/error.log`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

### Technical Support
- **GitHub Issues**: [Create an issue](https://github.com/shahzoorali/NashaMukht2025/issues)
- **Documentation**: Check the guides in this repository
- **Email**: [Your technical support email]

### Event Information
- **Organization**: Wakeup Humanity Organization
- **Contact**: 99635 52551 | 93460 13569
- **Website**: [www.wakeuphumanity.org](https://www.wakeuphumanity.org)
- **Event Date**: November 14, 2025
- **Location**: Sanjeevaiah Park, Necklace Road, Hyderabad

## 🙏 Acknowledgments

- **Wakeup Humanity Organization** for organizing the Nasha Mukht Bharat RUN
- **Shri V.C. Sajjanar, IPS** for being the Chief Guest
- **Twilio** for providing WhatsApp API services
- **AWS** for cloud infrastructure support
- **Open Source Community** for the amazing tools and libraries

## 📚 Additional Resources

- [Twilio WhatsApp API Documentation](https://www.twilio.com/docs/whatsapp)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

---

## 🏃‍♂️ Join the Movement

**Let's run together for a Drug-Free India! 🇮🇳**

Register for the Nasha Mukht Bharat RUN and be part of this important movement. Every step counts towards building a healthier, drug-free society.

**Event Details:**
- 📅 **Date**: November 14, 2025 (Friday)
- 🕖 **Time**: 7:00 AM – 9:00 AM
- 📍 **Location**: Sanjeevaiah Park, Necklace Road, Hyderabad
- 👨‍💼 **Chief Guest**: Shri V.C. Sajjanar, IPS, Commissioner of Police, Hyderabad

**Contact Information:**
- 📞 **Phone**: 99635 52551 | 93460 13569
- 🌐 **Website**: [www.wakeuphumanity.org](https://www.wakeuphumanity.org)

---

<div align="center">

**Made with ❤️ for Nasha Mukht Bharat RUN**

[![GitHub stars](https://img.shields.io/github/stars/shahzoorali/NashaMukht2025?style=social)](https://github.com/shahzoorali/NashaMukht2025/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shahzoorali/NashaMukht2025?style=social)](https://github.com/shahzoorali/NashaMukht2025/network)
[![GitHub issues](https://img.shields.io/github/issues/shahzoorali/NashaMukht2025)](https://github.com/shahzoorali/NashaMukht2025/issues)

</div>