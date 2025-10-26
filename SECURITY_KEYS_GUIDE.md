# 🔐 Security Keys Generation Guide

## How to Generate JWT_SECRET and ADMIN_PASSWORD_HASH

### Method 1: Using Node.js Commands (Recommended)

#### Generate JWT_SECRET
```bash
node -e "const crypto = require('crypto'); console.log('JWT_SECRET=' + crypto.randomBytes(64).toString('base64'));"
```

#### Generate ADMIN_PASSWORD_HASH
```bash
# First install bcrypt
npm install bcrypt

# Generate password hash (replace 'your_password' with your desired password)
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 12, (err, hash) => { if (err) console.error(err); else console.log('ADMIN_PASSWORD_HASH=' + hash); });"
```

### Method 2: Using the Generator Script

```bash
# Run the generator script
node generate-security-keys.js
```

### Method 3: Online Generators (Less Secure)

#### JWT Secret Generator
- Visit: https://generate-secret.vercel.app/64
- Copy the generated secret

#### Password Hash Generator
- Visit: https://bcrypt-generator.com/
- Enter your password
- Set rounds to 12
- Copy the generated hash

## 🔑 Generated Values for Your Project

Based on the generation above, here are your security keys:

```env
# Security
JWT_SECRET=teNMagqn0hz7TajQtB3PaFfMHyYB/H3mwspTMOah8vsZS2z7HAXl+3ABFkXAfnVIbCTTakPLgUN09e+2xHwPpQ==
ADMIN_PASSWORD_HASH=$2b$12$FI1uexLug2Z/f7tLUH3Qs.Fru1ggSUjRUIuhyFK/zNgAGOe4FnaqG
```

## 📋 Complete .env File Template

```env
# Environment Variables for NashaMukht Project
# Copy this file to .env and update the values

# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Server Configuration
PORT=3000
NODE_ENV=production

# Twilio Configuration (Add your Twilio credentials)
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
JWT_SECRET=teNMagqn0hz7TajQtB3PaFfMHyYB/H3mwspTMOah8vsZS2z7HAXl+3ABFkXAfnVIbCTTakPLgUN09e+2xHwPpQ==
ADMIN_PASSWORD_HASH=$2b$12$FI1uexLug2Z/f7tLUH3Qs.Fru1ggSUjRUIuhyFK/zNgAGOe4FnaqG

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

## ⚠️ Security Notes

### JWT_SECRET
- **Purpose**: Used for signing and verifying JWT tokens
- **Length**: 64 bytes (512 bits) - very secure
- **Format**: Base64 encoded random bytes
- **Security**: Keep this secret and never share it

### ADMIN_PASSWORD_HASH
- **Purpose**: Stores the hashed admin password for database
- **Algorithm**: bcrypt with 12 salt rounds
- **Default Password**: `admin123` (CHANGE THIS!)
- **Security**: The hash is irreversible, original password is not stored

## 🔒 Security Best Practices

1. **Change Default Password**: The default admin password is `admin123` - change it immediately
2. **Strong Passwords**: Use complex passwords with mixed case, numbers, and symbols
3. **Environment Variables**: Never commit `.env` files to version control
4. **Regular Rotation**: Consider rotating JWT secrets periodically
5. **Access Control**: Limit who has access to production environment variables

## 🛠️ How to Change Admin Password

### Method 1: Generate New Hash
```bash
# Generate hash for new password
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_new_password', 12, (err, hash) => { if (err) console.error(err); else console.log('ADMIN_PASSWORD_HASH=' + hash); });"
```

### Method 2: Update Database Directly
```sql
-- Update admin password in database
UPDATE admin_users SET password_hash = 'your_new_hash_here' WHERE username = 'admin';
```

## 🚀 Production Deployment

For production deployment:

1. **Generate New Keys**: Don't use the example keys in production
2. **Strong Password**: Use a complex admin password
3. **Secure Storage**: Store keys in secure environment variable management
4. **Access Logging**: Monitor admin access and changes
5. **Backup Security**: Ensure security keys are backed up securely

## 📞 Support

If you need help with security configuration:
- Check the main README.md for deployment instructions
- Review the EC2_DEPLOYMENT_GUIDE.md for production setup
- Contact the development team for security questions
