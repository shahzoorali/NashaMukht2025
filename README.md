# 🏃‍♂️ Nasha Mukht Bharat RUN - WhatsApp Registration System

A WhatsApp-based registration system for the **Nasha Mukht Bharat RUN** event organized by Wakeup Humanity Organization.

## 📅 Event Details

- **Event Name**: Nasha Mukht Bharat RUN
- **Date**: 14th November 2025 (Friday)
- **Time**: 7:00 AM – 9:00 AM
- **Location**: Sanjeevaiah Park, Necklace Road, Hyderabad
- **Chief Guest**: Shri V.C. Sajjanar, IPS, Commissioner of Police, Hyderabad
- **Contact**: 99635 52551 | 93460 13569
- **Website**: www.wakeuphumanity.org

## 🚀 Features

- **WhatsApp Registration**: Users can register via WhatsApp messages
- **WhatsApp Profile Name Capture**: Automatically captures and stores WhatsApp profile names
- **Real-time Admin Dashboard**: Monitor registrations with live statistics
- **User Management**: Change names, check status, get event information
- **Database Logging**: Complete message history and participant tracking
- **Error Handling**: Robust error handling with retry mechanisms
- **Rate Limiting**: Protection against spam and abuse
- **Health Monitoring**: Health check endpoints for system monitoring

## 🛠️ Tech Stack

- **Backend**: Node.js with Express
- **Database**: MySQL (AWS RDS)
- **WhatsApp API**: Twilio
- **Admin Panel**: PHP with responsive design
- **Logging**: Winston
- **Security**: Rate limiting, input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database access
- Twilio account with WhatsApp API access
- PHP (for admin panel)

## 🔧 Installation & Setup

### 1. Clone/Download the Project

```bash
# If using git
git clone <repository-url>
cd NashaMukht

# Or download and extract the files
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

1. **Create the database** using the provided schema:
   ```bash
   mysql -h bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com -u shahzoor -p NashaMukht < database_schema.sql
   ```

2. **For existing databases**, run the migration script to add WhatsApp profile name support:
   ```bash
   mysql -h bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com -u shahzoor -p NashaMukht < migration_add_whatsapp_profile.sql
   ```

3. **Verify database connection** with the credentials:
   - Host: `bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com`
   - Username: `shahzoor`
   - Password: `S!12hahzoorali`
   - Database: `NashaMukht`

### 4. Environment Configuration

1. **Copy the environment template**:
   ```bash
   cp env.example .env
   ```

2. **Update `.env` file** with your Twilio credentials:
   ```env
   # Database Configuration
   DB_HOST=bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com
   DB_USER=shahzoor
   DB_PASSWORD=S!12hahzoorali
   DB_NAME=NashaMukht

   # Twilio Configuration (REQUIRED)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number

   # Server Configuration
   PORT=3000
   NODE_ENV=production
   ```

### 5. Twilio Setup

1. **Create a Twilio account** at [twilio.com](https://twilio.com)
2. **Enable WhatsApp Sandbox** or get WhatsApp Business API access
3. **Configure webhook URL** in Twilio console:
   - Webhook URL: `https://yourdomain.com/whatsapp/messages`
   - HTTP Method: POST

### 6. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 7. Admin Panel Setup

1. **Upload `admin.php`** to your web server
2. **Access the admin panel** at: `https://yourdomain.com/admin.php`
3. **Monitor registrations** in real-time

## 📱 WhatsApp Bot Commands

Users can interact with the bot using these commands:

| Command | Description |
|---------|-------------|
| `hi`, `hello`, `start` | Start registration process |
| `[Full Name]` | Complete registration with name |
| `info` | Get event information |
| `status` | Check registration status |
| `change name` | Update registered name |

## 🔄 User Journey

1. **User sends "hi"** → Bot responds with event details and registration prompt
2. **User sends full name** → Bot registers user and provides registration ID
3. **User can check status** → Bot shows registration details
4. **User can change name** → Bot prompts for new name and updates record

## 📊 Database Schema

### Main Tables

- **`participants`**: Main participant data
- **`events`**: Event information
- **`message_logs`**: WhatsApp message history
- **`admin_users`**: Admin panel access
- **`event_stats`**: Analytics and statistics

### Key Fields

- `phone_number`: Unique WhatsApp number
- `full_name`: Participant's full name
- `whatsapp_profile_name`: WhatsApp profile name (automatically captured)
- `status`: Registration status (active, cancelled, etc.)
- `registration_date`: When they registered
- `registration_source`: How they registered (whatsapp, website, etc.)

## 🚦 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/whatsapp/messages` | POST | Main WhatsApp webhook |
| `/whatsapp/fallback` | POST | Fallback for failed messages |
| `/health` | GET | Health check endpoint |

## 📈 Monitoring & Analytics

- **Real-time statistics** in admin panel
- **Message logging** for all interactions
- **Registration trends** and analytics
- **Error tracking** with Winston logger

## 🔒 Security Features

- **Rate limiting** to prevent spam
- **Input validation** and sanitization
- **SQL injection protection** with prepared statements
- **Environment variables** for sensitive data
- **Error handling** without exposing sensitive information

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials in `.env`
   - Verify network connectivity to AWS RDS
   - Ensure database exists and schema is created

2. **Twilio Webhook Not Working**
   - Verify webhook URL is accessible
   - Check Twilio account credentials
   - Ensure WhatsApp sandbox is properly configured

3. **Messages Not Being Received**
   - Check server logs for errors
   - Verify Twilio webhook configuration
   - Test with Twilio's webhook testing tools

### Logs Location

- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`
- **Console output**: Real-time in terminal

## 🔄 Deployment

### Production Deployment

1. **Set up a production server** (AWS EC2, DigitalOcean, etc.)
2. **Install Node.js and PM2** for process management
3. **Configure reverse proxy** (Nginx) for SSL and domain
4. **Set up SSL certificate** for HTTPS
5. **Configure environment variables** for production
6. **Set up log rotation** and monitoring

### PM2 Configuration

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start app.js --name "nasha-mukht-bot"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📞 Support

For technical support or questions:

- **Organization**: Wakeup Humanity Organization
- **Contact**: 99635 52551 | 93460 13569
- **Website**: www.wakeuphumanity.org

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Changelog

### Version 1.0.0
- Initial release
- WhatsApp registration system
- Admin dashboard
- Database schema
- Error handling and logging

---

**🏃‍♂️ Let's run together for a Drug-Free India! 🇮🇳**
