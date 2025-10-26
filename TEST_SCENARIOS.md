# NashaMukht - WhatsApp Bot Test Scenarios

## Test Environment Setup

Before testing, ensure:
- [ ] Application is running (`npm start`)
- [ ] Database is connected and accessible
- [ ] Twilio webhook is configured
- [ ] Admin panel is accessible

## Test Scenarios

### 1. New User Registration Flow

**Test Case 1.1: Initial Greeting**
```
User sends: "hi"
Expected Response: Event information + registration prompt
Expected Database: No new record created
Expected Log: Message logged as incoming/outgoing
```

**Test Case 1.2: Complete Registration**
```
User sends: "John Doe"
Expected Response: Registration confirmation with ID
Expected Database: New participant record created
Expected Log: Registration logged
```

**Test Case 1.3: Invalid Name**
```
User sends: "A" (single character)
Expected Response: Error message asking for full name
Expected Database: No new record created
```

### 2. Existing User Interactions

**Test Case 2.1: Check Status**
```
User sends: "status"
Expected Response: Registration details + event info
Expected Database: No changes
```

**Test Case 2.2: Get Event Info**
```
User sends: "info"
Expected Response: Complete event information
Expected Database: No changes
```

**Test Case 2.3: Change Name Request**
```
User sends: "change name"
Expected Response: Prompt for new name
Expected Database: Status updated to 'awaiting_new_name'
```

**Test Case 2.4: Complete Name Change**
```
User sends: "Jane Smith" (after change name request)
Expected Response: Name updated confirmation
Expected Database: Name updated, status back to 'active'
```

### 3. Error Handling Tests

**Test Case 3.1: Database Connection Error**
```
Simulate database disconnect
User sends: "hi"
Expected Response: Error message (not exposing details)
Expected Log: Error logged
```

**Test Case 3.2: Invalid Phone Number**
```
User sends from invalid number format
Expected Response: Invalid phone number message
Expected Database: No record created
```

**Test Case 3.3: Rate Limiting**
```
Send multiple messages quickly
Expected Response: Rate limit exceeded message
Expected Behavior: Subsequent messages blocked temporarily
```

### 4. Admin Panel Tests

**Test Case 4.1: Dashboard Load**
```
Access: https://yourdomain.com/admin.php
Expected: Dashboard loads with statistics
Expected: All sections visible and responsive
```

**Test Case 4.2: Statistics Accuracy**
```
Register 5 new users
Refresh admin panel
Expected: Statistics updated correctly
Expected: Recent registrations show new users
```

**Test Case 4.3: Mobile Responsiveness**
```
Access admin panel on mobile device
Expected: Layout adapts to mobile screen
Expected: All data visible and accessible
```

### 5. Performance Tests

**Test Case 5.1: Concurrent Registrations**
```
Simulate 10 simultaneous registrations
Expected: All processed successfully
Expected: No database locks or errors
```

**Test Case 5.2: Large Data Volume**
```
Register 100+ users
Expected: Admin panel loads quickly
Expected: Statistics calculate correctly
```

### 6. Security Tests

**Test Case 6.1: SQL Injection Attempt**
```
User sends: "'; DROP TABLE participants; --"
Expected: Input sanitized, no SQL executed
Expected: Error message returned
```

**Test Case 6.2: XSS Attempt**
```
User sends: "<script>alert('xss')</script>"
Expected: Script tags stripped
Expected: Safe text stored in database
```

## Test Data

### Sample Participants
```
Phone: +919876543210, Name: "Test User 1"
Phone: +919876543211, Name: "Test User 2"
Phone: +919876543212, Name: "Test User 3"
```

### Test Messages
```
Valid Names: "John Doe", "Jane Smith", "Dr. Rajesh Kumar"
Invalid Names: "A", "", "   ", "X" * 200
Special Characters: "O'Connor", "José", "李小明"
```

## Expected Database States

### After Registration
```sql
SELECT COUNT(*) FROM participants WHERE status = 'active';
-- Should equal number of successful registrations

SELECT COUNT(*) FROM message_logs WHERE message_type = 'incoming';
-- Should equal total messages received
```

### After Name Change
```sql
SELECT * FROM participants WHERE status = 'awaiting_new_name';
-- Should show users waiting for name update

SELECT * FROM message_logs WHERE message_content LIKE '%change name%';
-- Should show name change requests
```

## Test Results Template

| Test Case | Status | Expected | Actual | Notes |
|-----------|--------|----------|--------|-------|
| 1.1 | ✅/❌ | Event info shown | | |
| 1.2 | ✅/❌ | Registration successful | | |
| 2.1 | ✅/❌ | Status displayed | | |
| 3.1 | ✅/❌ | Error handled gracefully | | |
| 4.1 | ✅/❌ | Admin panel loads | | |

## Automated Testing Script

```bash
#!/bin/bash
# test_bot.sh - Automated testing script

echo "Starting NashaMukht Bot Tests..."

# Test health endpoint
curl -f http://localhost:3000/health || echo "Health check failed"

# Test admin panel
curl -f http://localhost:3000/admin.php || echo "Admin panel failed"

# Test database connection
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

echo "Tests completed!"
```

## Performance Benchmarks

### Response Time Targets
- WhatsApp webhook response: < 2 seconds
- Admin panel load: < 3 seconds
- Database queries: < 500ms
- Health check: < 100ms

### Throughput Targets
- Concurrent users: 50+
- Messages per minute: 100+
- Database connections: 10 max
- Memory usage: < 100MB

## Test Environment Cleanup

After testing:
```sql
-- Clean up test data
DELETE FROM participants WHERE phone_number LIKE '+9198765432%';
DELETE FROM message_logs WHERE phone_number LIKE '+9198765432%';

-- Reset statistics
UPDATE event_stats SET 
    total_registrations = (SELECT COUNT(*) FROM participants),
    active_registrations = (SELECT COUNT(*) FROM participants WHERE status = 'active');
```

---

**Test Date**: [Current Date]
**Tester**: [Your Name]
**Version**: 1.0.0
