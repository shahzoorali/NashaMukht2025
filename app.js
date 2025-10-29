require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const mysql = require('mysql');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { MessagingResponse } = require('twilio').twiml;

console.log("🏃‍♂️ Nasha Mukht Bharat RUN - WhatsApp Registration System Starting...");

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting
const whatsappLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

console.log("Setting up MySQL connection pool...");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'shahzoor',
    password: process.env.DB_PASSWORD || 'S!12hahzoorali',
    database: process.env.DB_NAME || 'NashaMukht',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// Database connection event handlers
pool.on('connection', function (connection) {
    logger.info('New MySQL connection established');
});

pool.on('error', function(err) {
    logger.error('Database connection error:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        logger.info('Database connection was closed.');
    }
    if(err.code === 'ER_CON_COUNT_ERROR') {
        logger.error('Database has too many connections.');
    }
    if(err.code === 'ECONNREFUSED') {
        logger.error('Database connection was refused.');
    }
});

console.log("Express app setup...");
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/whatsapp', whatsappLimiter);

// Event information
const EVENT_INFO = {
    name: process.env.EVENT_NAME || 'Nasha Mukht Bharat RUN',
    date: process.env.EVENT_DATE || '2025-11-14',
    time: process.env.EVENT_TIME || '07:00',
    location: process.env.EVENT_LOCATION || 'Sanjeevaiah Park, Necklace Road, Hyderabad',
    contact1: process.env.EVENT_CONTACT_1 || '99635 52551',
    contact2: process.env.EVENT_CONTACT_2 || '93460 13569',
    website: process.env.EVENT_WEBSITE || 'www.wakeuphumanity.org'
};

// Helper functions
function validatePhoneNumber(phone) {
    return /^\+?[1-9]\d{1,14}$/.test(phone);
}

function sanitizeName(name) {
    if (!name || typeof name !== 'string') {
        return '';
    }
    return name.trim().replace(/[<>]/g, '');
}

function generateCustomRegistrationId(callback) {
    // Get the highest existing registration ID
    pool.query('SELECT MAX(CAST(SUBSTRING(registration_id, 2) AS UNSIGNED)) as max_id FROM participants WHERE registration_id REGEXP "^0[0-9]+$"', (error, results) => {
        if (error) {
            logger.error('Error getting max registration ID:', error);
            callback(error, null);
        } else {
            const maxId = results[0].max_id || 1000;
            const nextId = maxId + 1;
            const customId = '0' + nextId.toString().padStart(4, '0');
            callback(null, customId);
        }
    });
}

function logMessage(phoneNumber, messageType, content, participantId = null) {
    // First, validate that participantId exists if provided
    if (participantId) {
        pool.query('SELECT id FROM participants WHERE id = ?', [participantId], (checkError, checkResults) => {
            if (checkError) {
                logger.error('Error checking participant existence:', checkError);
                // Log without participant_id
                logMessageWithoutParticipant(phoneNumber, messageType, content);
                return;
            }
            
            if (checkResults.length === 0) {
                logger.warn(`Participant with ID ${participantId} not found, logging without participant_id`);
                // Log without participant_id
                logMessageWithoutParticipant(phoneNumber, messageType, content);
                return;
            }
            
            // Participant exists, proceed with normal logging
            logMessageWithParticipant(phoneNumber, messageType, content, participantId);
        });
    } else {
        // No participant_id provided, log without it
        logMessageWithoutParticipant(phoneNumber, messageType, content);
    }
}

function logMessageWithParticipant(phoneNumber, messageType, content, participantId) {
    const query = 'INSERT INTO message_logs (phone_number, message_type, message_content, participant_id) VALUES (?, ?, ?, ?)';
    pool.query(query, [phoneNumber, messageType, content, participantId], (error) => {
        if (error) {
            logger.error('Error logging message with participant:', error);
            // Fallback to logging without participant_id
            logMessageWithoutParticipant(phoneNumber, messageType, content);
        }
    });
}

function logMessageWithoutParticipant(phoneNumber, messageType, content) {
    const query = 'INSERT INTO message_logs (phone_number, message_type, message_content, participant_id) VALUES (?, ?, ?, NULL)';
    pool.query(query, [phoneNumber, messageType, content], (error) => {
        if (error) {
            logger.error('Error logging message without participant:', error);
        }
    });
}

function sendResponse(res, response) {
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(response.toString());
}

function getEventInfoMessage() {
    return `🏃‍♂️ ${EVENT_INFO.name} 🏃‍♀️
Let's run together for a Drug-Free India! 🇮🇳

📅 Date: ${EVENT_INFO.date} (Friday)
🕖 Time: ${EVENT_INFO.time} AM – 9:00 AM
📍 Location: ${EVENT_INFO.location}

We're honoured to have Shri V.C. Sajjanar, IPS, Commissioner of Police, Hyderabad as our Chief Guest 🙏

📞 Contact: ${EVENT_INFO.contact1} | ${EVENT_INFO.contact2}
🌐 Website: ${EVENT_INFO.website}

Join the movement — Say No to Drugs, Yes to Life! 🌿`;
}

// Twilio webhook endpoint (forwards to main messages endpoint)
app.post('/webhook', (req, res) => {
    logger.info('Webhook request received, forwarding to /whatsapp/messages');
    logger.info('Webhook request body:', req.body);
    // Forward the request to the main messages endpoint
    req.url = '/whatsapp/messages';
    app._router.handle(req, res);
});

// Main WhatsApp webhook endpoint
app.post('/whatsapp/messages', (req, res) => {
    try {
        // Add null checks for request body properties
        if (!req.body || !req.body.From) {
            logger.warn('Invalid webhook request: missing From field', req.body);
            const MessagingResponse = twilio.twiml.MessagingResponse;
            const response = new MessagingResponse();
            response.message("Invalid request format. Please try again.");
            sendResponse(res, response);
            return;
        }

        // Additional validation for required fields
        if (!req.body.From || typeof req.body.From !== 'string') {
            logger.warn('Invalid webhook request: From field is not a string', req.body);
            const MessagingResponse = twilio.twiml.MessagingResponse;
            const response = new MessagingResponse();
            response.message("Invalid request format. Please try again.");
            sendResponse(res, response);
            return;
        }

        // Safely extract and validate webhook data
        const fromNumber = (req.body.From || '').replace('whatsapp:', '');
        const receivedMessage = (req.body.Body || '').trim();
        const whatsappProfileName = req.body.ProfileName || null; // WhatsApp profile name
        
        // Additional validation to prevent undefined errors
        if (typeof fromNumber !== 'string' || typeof receivedMessage !== 'string') {
            logger.warn('Invalid webhook data types:', { fromNumber, receivedMessage, body: req.body });
            const MessagingResponse = twilio.twiml.MessagingResponse;
            const response = new MessagingResponse();
            response.message("Invalid request format. Please try again.");
            sendResponse(res, response);
            return;
        }
        const MessagingResponse = twilio.twiml.MessagingResponse;
        const response = new MessagingResponse();

        // Log incoming message
        logMessage(fromNumber, 'incoming', receivedMessage);

        // Validate phone number
        if (!validatePhoneNumber(fromNumber)) {
            logger.warn(`Invalid phone number received: ${fromNumber}`);
            response.message("Invalid phone number format. Please use a valid mobile number.");
            sendResponse(res, response);
            return;
        }

        pool.query('SELECT * FROM participants WHERE phone_number = ?', [fromNumber], (error, results) => {
            if (error) {
                logger.error("Error querying the database: ", error);
                response.message("We encountered an error. Please try again later.");
                logMessage(fromNumber, 'outgoing', response.toString(), null);
                sendResponse(res, response);
                return;
            }

            if (results.length > 0) {
                const participant = results[0];
                
                if (participant.status === 'awaiting_new_name') {
                    // Update participant's name in the database
                    const sanitizedName = sanitizeName(receivedMessage);
                    pool.query('UPDATE participants SET full_name = ?, whatsapp_profile_name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_number = ?', 
                        [sanitizedName, whatsappProfileName, 'active', fromNumber], (updateError) => {
                        if (updateError) {
                            logger.error("Error updating participant name in the database: ", updateError);
                            response.message("We encountered an error updating your name. Please try again later.");
                        } else {
                            response.message(`✅ Your name has been successfully updated to: ${sanitizedName}\n\n${getEventInfoMessage()}`);
                            logger.info(`Participant ${fromNumber} updated name to: ${sanitizedName}`);
                        }
                        logMessage(fromNumber, 'outgoing', response.toString(), participant.id);
                        sendResponse(res, response);
                    });
                } else if (receivedMessage.toLowerCase() === "change name") {
                    // Set participant's status to 'awaiting_new_name' and update profile name
                    pool.query('UPDATE participants SET status = ?, whatsapp_profile_name = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_number = ?', 
                        ['awaiting_new_name', whatsappProfileName, fromNumber], (updateError) => {
                        if (updateError) {
                            logger.error("Error setting participant status in the database: ", updateError);
                            response.message("We encountered an error. Please try again later.");
                        } else {
                            response.message("Please reply with your new FULL NAME to update your registration.");
                        }
                        logMessage(fromNumber, 'outgoing', response.toString(), participant.id);
                        sendResponse(res, response);
                    });
                } else if (receivedMessage.toLowerCase() === "info") {
                    response.message(getEventInfoMessage());
                    logMessage(fromNumber, 'outgoing', response.toString(), participant.id);
                    sendResponse(res, response);
                } else if (receivedMessage.toLowerCase() === "status") {
                    response.message(`✅ You are already registered!\n\nRegistration ID: ${participant.registration_id}\nName: ${participant.full_name}\nRegistration Date: ${participant.registration_date}\n\nCommands:\n• 'Info' - Event details\n• 'Change Name' - Update your name`);
                    logMessage(fromNumber, 'outgoing', response.toString(), participant.id);
                    sendResponse(res, response);
                } else if (receivedMessage.startsWith("DELETE ")) {
                    // Handle hidden DELETE command (admin function)
                    const deleteMatch = receivedMessage.match(/^DELETE\s+(.+)$/);
                    if (deleteMatch) {
                        const deleteId = deleteMatch[1].trim();
                        
                        // Check if it's a numeric ID or registration ID
                        let query, queryParams;
                        if (/^\d+$/.test(deleteId)) {
                            // Numeric ID (like 9)
                            query = 'DELETE FROM participants WHERE id = ?';
                            queryParams = [parseInt(deleteId)];
                        } else {
                            // Registration ID (like 01010)
                            query = 'DELETE FROM participants WHERE registration_id = ?';
                            queryParams = [deleteId];
                        }
                        
                        // Delete any participant by ID or registration_id (admin command)
                        logger.info(`[EXISTING USER] Attempting to delete: ${deleteId} with query: ${query} and params: ${JSON.stringify(queryParams)}`);
                        pool.query(query, queryParams, (deleteError, deleteResults) => {
                            logger.info(`[EXISTING USER] Delete query result: error=${deleteError}, affectedRows=${deleteResults?.affectedRows}, results=${JSON.stringify(deleteResults)}`);
                            if (deleteError) {
                                logger.error("Error deleting participant from database: ", deleteError);
                                response.message("We encountered an error. Please try again later.");
                            } else if (deleteResults.affectedRows === 0) {
                                logger.warn(`[EXISTING USER] No rows affected for DELETE query: ${query} with params: ${JSON.stringify(queryParams)}`);
                                response.message("Registration not found.");
                            } else {
                                response.message(`✅ Registration (ID: ${deleteId}) has been successfully deleted.`);
                                logger.info(`Admin ${fromNumber} deleted registration ID: ${deleteId}`);
                            }
                            logMessage(fromNumber, 'outgoing', response.toString(), null);
                            sendResponse(res, response);
                        });
                    } else {
                        response.message("Invalid command format.");
                        logMessage(fromNumber, 'outgoing', response.toString(), participant.id);
                        sendResponse(res, response);
                    }
                } else {
                    // Update WhatsApp profile name if it has changed
                    if (whatsappProfileName && whatsappProfileName !== participant.whatsapp_profile_name) {
                        pool.query('UPDATE participants SET whatsapp_profile_name = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_number = ?', 
                            [whatsappProfileName, fromNumber], (profileUpdateError) => {
                            if (profileUpdateError) {
                                logger.error("Error updating WhatsApp profile name:", profileUpdateError);
                            } else {
                                logger.info(`Updated WhatsApp profile name for ${fromNumber}: ${whatsappProfileName}`);
                            }
                        });
                    }
                    
                    response.message(`✅ You are already registered for ${EVENT_INFO.name}!\n\nYour Registration ID: ${participant.registration_id}\nName: ${participant.full_name}\n\nCommands:\n• 'Info' - Event details\n• 'Change Name' - Update your name`);
                    logMessage(fromNumber, 'outgoing', response.toString(), participant.id);
                    sendResponse(res, response);
                }
            } else {
                // New participant
                if (receivedMessage.toLowerCase() === "hi" || receivedMessage.toLowerCase() === "hello" || receivedMessage.toLowerCase() === "start") {
                    response.message(`🏃‍♂️ Welcome to ${EVENT_INFO.name}! 🏃‍♀️\n\nPlease reply with your FULL NAME to complete registration.`);
                    logMessage(fromNumber, 'outgoing', response.toString(), null);
                    sendResponse(res, response);
                } else if (receivedMessage.startsWith("DELETE ")) {
                    // Handle hidden DELETE command (admin function) for new users
                    const deleteMatch = receivedMessage.match(/^DELETE\s+(.+)$/);
                    if (deleteMatch) {
                        const deleteId = deleteMatch[1].trim();
                        
                        // Check if it's a numeric ID or registration ID
                        let query, queryParams;
                        if (/^\d+$/.test(deleteId)) {
                            // Numeric ID (like 9)
                            query = 'DELETE FROM participants WHERE id = ?';
                            queryParams = [parseInt(deleteId)];
                        } else {
                            // Registration ID (like 01010)
                            query = 'DELETE FROM participants WHERE registration_id = ?';
                            queryParams = [deleteId];
                        }
                        
                        // Delete any participant by ID or registration_id (admin command)
                        logger.info(`[NEW USER] Attempting to delete: ${deleteId} with query: ${query} and params: ${JSON.stringify(queryParams)}`);
                        pool.query(query, queryParams, (deleteError, deleteResults) => {
                            logger.info(`[NEW USER] Delete query result: error=${deleteError}, affectedRows=${deleteResults?.affectedRows}, results=${JSON.stringify(deleteResults)}`);
                            if (deleteError) {
                                logger.error("Error deleting participant from database: ", deleteError);
                                response.message("We encountered an error. Please try again later.");
                            } else if (deleteResults.affectedRows === 0) {
                                logger.warn(`[NEW USER] No rows affected for DELETE query: ${query} with params: ${JSON.stringify(queryParams)}`);
                                response.message("Registration not found.");
                            } else {
                                response.message(`✅ Registration (ID: ${deleteId}) has been successfully deleted.`);
                                logger.info(`Admin ${fromNumber} deleted registration ID: ${deleteId}`);
                            }
                            logMessage(fromNumber, 'outgoing', response.toString(), null);
                            sendResponse(res, response);
                        });
                    } else {
                        response.message("Invalid command format.");
                        logMessage(fromNumber, 'outgoing', response.toString(), null);
                        sendResponse(res, response);
                    }
                } else {
                    // Register new participant
                    const sanitizedName = sanitizeName(receivedMessage);
                    if (sanitizedName.length < 2) {
                        response.message("Please provide your full name (at least 2 characters).");
                        logMessage(fromNumber, 'outgoing', response.toString(), null);
                        sendResponse(res, response);
                        return;
                    }

                    // Generate custom registration ID first
                    generateCustomRegistrationId((idError, customId) => {
                        if (idError) {
                            logger.error("Error generating custom registration ID: ", idError);
                            response.message("We encountered an error while processing your registration. Please try again later.");
                            logMessage(fromNumber, 'outgoing', response.toString(), null);
                            sendResponse(res, response);
                            return;
                        }

                        pool.query('INSERT INTO participants (registration_id, phone_number, full_name, whatsapp_profile_name, registration_source) VALUES (?, ?, ?, ?, ?)', 
                            [customId, fromNumber, sanitizedName, whatsappProfileName, 'whatsapp'], (insertError, insertResults) => {
                            if (insertError) {
                                logger.error("Error inserting data into the database: ", insertError);
                                response.message("We encountered an error while processing your registration. Please try again later.");
                            } else {
                                response.message(`🎉 Thank you ${sanitizedName}! You are successfully registered for ${EVENT_INFO.name}!\n\nYour Registration ID: ${customId}\n\nCommands:\n• 'Info' - Event details\n• 'Change Name' - Update your name`);
                                logger.info(`New participant registered: ${sanitizedName} (${fromNumber}) with Registration ID: ${customId}`);
                                
                                // Send image after registration confirmation
                                setTimeout(() => {
                                    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                                    twilioClient.messages.create({
                                        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
                                        to: `whatsapp:${fromNumber}`,
                                        mediaUrl: ['https://bot.ravist.in/nashamukht.jpg']
                                    }).then(message => {
                                        logger.info(`Image sent to ${fromNumber}: ${message.sid}`);
                                    }).catch(error => {
                                        logger.error(`Error sending image to ${fromNumber}:`, error);
                                    });
                                }, 1000);
                            }
                            logMessage(fromNumber, 'outgoing', response.toString(), insertResults ? insertResults.insertId : null);
                            sendResponse(res, response);
                        });
                    });
                }
            }
        });
    } catch (error) {
        logger.error('Unexpected error in WhatsApp webhook:', error);
        logger.error('Request body:', req.body);
        const MessagingResponse = twilio.twiml.MessagingResponse;
        const response = new MessagingResponse();
        response.message("We encountered an unexpected error. Please try again later.");
        sendResponse(res, response);
    }
});

// Fallback endpoint for failed messages
const messageQueue = [];
const MAX_RETRIES = 3;

app.post('/whatsapp/fallback', (req, res) => {
    logger.warn('WhatsApp fallback endpoint triggered:', req.body);
    messageQueue.push({ message: req.body, retries: 0, timestamp: new Date() });
    res.status(200).send('Message queued for retry');
});

// Function to retry processing messages from the queue
function retryFailedMessages() {
    messageQueue.forEach((item, index) => {
        if (item.retries < MAX_RETRIES) {
            try {
                // Attempt to reprocess the message
                logger.info(`Retrying message for ${item.message.From}, attempt ${item.retries + 1}`);
                // Here you would implement the retry logic
                messageQueue.splice(index, 1);
            } catch (error) {
                item.retries++;
                logger.error('Retry failed:', error);
            }
        } else {
            logger.error('Max retries reached for message:', item.message);
            messageQueue.splice(index, 1);
        }
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    pool.query('SELECT 1', (error) => {
        if (error) {
            res.status(500).json({ status: 'error', message: 'Database connection failed' });
        } else {
            res.status(200).json({ 
                status: 'healthy', 
                timestamp: new Date().toISOString(),
                event: EVENT_INFO.name,
                version: '1.0.0'
            });
        }
    });
});

// Error handling for uncaught exceptions and rejections
process.on('uncaughtException', error => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', error => {
    logger.error('Unhandled Rejection:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    pool.end(() => {
        logger.info('Database connections closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    pool.end(() => {
        logger.info('Database connections closed');
        process.exit(0);
    });
});

// Function to check if port is available
function checkPort(port) {
    return new Promise((resolve, reject) => {
        const net = require('net');
        const server = net.createServer();
        
        server.listen(port, () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                reject(err);
            }
        });
    });
}

// Function to find available port
async function findAvailablePort(startPort) {
    let port = startPort;
    const maxPort = startPort + 100; // Try up to 100 ports
    
    while (port <= maxPort) {
        const isAvailable = await checkPort(port);
        if (isAvailable) {
            return port;
        }
        port++;
    }
    
    throw new Error(`No available ports found between ${startPort} and ${maxPort}`);
}

// Function to kill existing process on port
function killProcessOnPort(port) {
    return new Promise((resolve) => {
        const { exec } = require('child_process');
        exec(`lsof -ti:${port}`, (error, stdout) => {
            if (error || !stdout.trim()) {
                resolve();
                return;
            }
            
            const pids = stdout.trim().split('\n');
            pids.forEach(pid => {
                exec(`kill -9 ${pid}`, (killError) => {
                    if (killError) {
                        logger.warn(`Failed to kill process ${pid}:`, killError.message);
                    } else {
                        logger.info(`Killed existing process ${pid} on port ${port}`);
                    }
                });
            });
            
            // Wait a bit for processes to be killed
            setTimeout(resolve, 2000);
        });
    });
}

// Start server with port conflict resolution
async function startServer() {
    try {
        console.log("Starting server...");
        
        // Check if port is in use
        const isPortAvailable = await checkPort(port);
        
        if (!isPortAvailable) {
            logger.warn(`Port ${port} is in use, attempting to free it...`);
            await killProcessOnPort(port);
            
            // Wait a bit and check again
            await new Promise(resolve => setTimeout(resolve, 3000));
            const isStillInUse = await checkPort(port);
            
            if (!isStillInUse) {
                logger.info(`Port ${port} is now available`);
            } else {
                logger.warn(`Port ${port} is still in use, finding alternative port...`);
                const newPort = await findAvailablePort(port);
                logger.info(`Using alternative port: ${newPort}`);
                process.env.PORT = newPort;
            }
        }
        
        const finalPort = process.env.PORT || port;
        
        app.listen(finalPort, () => {
            logger.info(`🏃‍♂️ Nasha Mukht Bharat RUN server running at http://localhost:${finalPort}`);
            logger.info(`Event: ${EVENT_INFO.name} on ${EVENT_INFO.date} at ${EVENT_INFO.location}`);
            
            // Signal PM2 that the app is ready
            if (process.send) {
                process.send('ready');
            }
        }).on('error', err => {
            logger.error('Failed to start server:', err);
            if (err.code === 'EADDRINUSE') {
                logger.error('Port is still in use. Please check for other running instances.');
                logger.error('Try running: pm2 stop nasha-mukht-bot && pm2 start ecosystem.config.js');
            }
            process.exit(1);
        });
        
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
