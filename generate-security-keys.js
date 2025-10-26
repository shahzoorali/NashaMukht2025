// Security Key Generator for NashaMukht Project
// Run this script to generate secure JWT_SECRET and ADMIN_PASSWORD_HASH

const crypto = require('crypto');
const bcrypt = require('bcrypt');

console.log('🔐 Generating Security Keys for NashaMukht Project\n');

// Generate JWT Secret (64 random bytes, base64 encoded)
const jwtSecret = crypto.randomBytes(64).toString('base64');
console.log('JWT_SECRET=' + jwtSecret);

// Generate Admin Password Hash
const adminPassword = 'admin123'; // Change this to your desired admin password
const saltRounds = 12;

bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating password hash:', err);
        return;
    }
    
    console.log('ADMIN_PASSWORD_HASH=' + hash);
    console.log('\n📋 Copy these values to your .env file:');
    console.log('=====================================');
    console.log('JWT_SECRET=' + jwtSecret);
    console.log('ADMIN_PASSWORD_HASH=' + hash);
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('- Keep these values secret and never commit them to version control');
    console.log('- Store them securely in your .env file');
    console.log('- The admin password is: ' + adminPassword);
    console.log('- Change the admin password after first login');
    console.log('- Use a strong, unique password in production');
});
