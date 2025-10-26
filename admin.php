<?php
// Nasha Mukht Bharat RUN - Admin Dashboard
// Database connection variables
$servername = "bbin.cfuk0cmy2lip.ap-south-1.rds.amazonaws.com";
$username = "shahzoor";
$password = "S!12hahzoorali";
$dbname = "NashaMukht";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Event information
$event_name = "Nasha Mukht Bharat RUN";
$event_date = "2025-11-14";
$event_time = "07:00 AM";
$event_location = "Sanjeevaiah Park, Necklace Road, Hyderabad";

// Get statistics
$stats_query = "SELECT 
    COUNT(*) as total_registrations,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_registrations,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_registrations,
    SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) as male_participants,
    SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) as female_participants
    FROM participants";

$stats_result = $conn->query($stats_query);
$stats = $stats_result->fetch_assoc();

// Get recent registrations
$recent_query = "SELECT id, phone_number, full_name, whatsapp_profile_name, registration_date, status 
                 FROM participants 
                 ORDER BY registration_date DESC 
                 LIMIT 20";
$recent_result = $conn->query($recent_query);

// Get today's registrations
$today_query = "SELECT COUNT(*) as today_count 
                FROM participants 
                WHERE DATE(registration_date) = CURDATE()";
$today_result = $conn->query($today_query);
$today_stats = $today_result->fetch_assoc();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $event_name; ?> - Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #ff6b6b;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 1.1em;
        }
        
        .content {
            padding: 30px;
        }
        
        .section-title {
            font-size: 1.8em;
            color: #333;
            margin-bottom: 20px;
            border-bottom: 3px solid #ff6b6b;
            padding-bottom: 10px;
        }
        
        .table-container {
            overflow-x: auto;
            margin-bottom: 30px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #ff6b6b;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 1px;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .status-active {
            color: #28a745;
            font-weight: bold;
        }
        
        .status-cancelled {
            color: #dc3545;
            font-weight: bold;
        }
        
        .status-awaiting {
            color: #ffc107;
            font-weight: bold;
        }
        
        .event-info {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .event-info h3 {
            font-size: 1.5em;
            margin-bottom: 15px;
        }
        
        .event-info p {
            margin-bottom: 8px;
            font-size: 1.1em;
        }
        
        .refresh-btn {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            margin-bottom: 20px;
            transition: background 0.3s ease;
        }
        
        .refresh-btn:hover {
            background: #ee5a24;
        }
        
        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }
        
        .whatsapp-profile {
            font-style: italic;
            color: #666;
            font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }
            
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                padding: 20px;
            }
            
            .stat-number {
                font-size: 2em;
            }
            
            th, td {
                padding: 10px;
                font-size: 0.9em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏃‍♂️ <?php echo $event_name; ?> 🏃‍♀️</h1>
            <p>Admin Dashboard - WhatsApp Registration System</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total_registrations']; ?></div>
                <div class="stat-label">Total Registrations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['active_registrations']; ?></div>
                <div class="stat-label">Active Participants</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['cancelled_registrations']; ?></div>
                <div class="stat-label">Cancelled</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['male_participants']; ?></div>
                <div class="stat-label">Male Participants</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['female_participants']; ?></div>
                <div class="stat-label">Female Participants</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $today_stats['today_count']; ?></div>
                <div class="stat-label">Today's Registrations</div>
            </div>
        </div>
        
        <div class="content">
            <div class="event-info">
                <h3>📅 Event Information</h3>
                <p><strong>Date:</strong> <?php echo $event_date; ?> (Friday)</p>
                <p><strong>Time:</strong> <?php echo $event_time; ?> AM – 9:00 AM</p>
                <p><strong>Location:</strong> <?php echo $event_location; ?></p>
                <p><strong>Chief Guest:</strong> Shri V.C. Sajjanar, IPS, Commissioner of Police, Hyderabad</p>
                <p><strong>Contact:</strong> 99635 52551 | 93460 13569</p>
                <p><strong>Website:</strong> www.wakeuphumanity.org</p>
            </div>
            
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
            
            <h2 class="section-title">📋 Recent Registrations</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Phone Number</th>
                            <th>Full Name</th>
                            <th>WhatsApp Profile</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        if ($recent_result->num_rows > 0) {
                            while($row = $recent_result->fetch_assoc()) {
                                $status_class = '';
                                switch($row['status']) {
                                    case 'active':
                                        $status_class = 'status-active';
                                        break;
                                    case 'cancelled':
                                        $status_class = 'status-cancelled';
                                        break;
                                    case 'awaiting_new_name':
                                        $status_class = 'status-awaiting';
                                        break;
                                }
                                
                                echo "<tr>";
                                echo "<td>" . $row["id"] . "</td>";
                                echo "<td>" . $row["phone_number"] . "</td>";
                                echo "<td>" . htmlspecialchars($row["full_name"]) . "</td>";
                                echo "<td class='whatsapp-profile'>" . htmlspecialchars($row["whatsapp_profile_name"] ?: 'N/A') . "</td>";
                                echo "<td>" . date('d M Y, H:i', strtotime($row["registration_date"])) . "</td>";
                                echo "<td class='$status_class'>" . ucfirst($row["status"]) . "</td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='6' style='text-align: center; color: #666;'>No registrations found</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
            
            <h2 class="section-title">📊 All Participants</h2>
            <div class="table-container">
                <?php
                // Get all participants
                $all_query = "SELECT id, phone_number, full_name, whatsapp_profile_name, registration_date, status FROM participants ORDER BY registration_date DESC";
                $all_result = $conn->query($all_query);
                ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Phone Number</th>
                            <th>Full Name</th>
                            <th>WhatsApp Profile</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        if ($all_result->num_rows > 0) {
                            while($row = $all_result->fetch_assoc()) {
                                $status_class = '';
                                switch($row['status']) {
                                    case 'active':
                                        $status_class = 'status-active';
                                        break;
                                    case 'cancelled':
                                        $status_class = 'status-cancelled';
                                        break;
                                    case 'awaiting_new_name':
                                        $status_class = 'status-awaiting';
                                        break;
                                }
                                
                                echo "<tr>";
                                echo "<td>" . $row["id"] . "</td>";
                                echo "<td>" . $row["phone_number"] . "</td>";
                                echo "<td>" . htmlspecialchars($row["full_name"]) . "</td>";
                                echo "<td class='whatsapp-profile'>" . htmlspecialchars($row["whatsapp_profile_name"] ?: 'N/A') . "</td>";
                                echo "<td>" . date('d M Y, H:i', strtotime($row["registration_date"])) . "</td>";
                                echo "<td class='$status_class'>" . ucfirst($row["status"]) . "</td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='6' style='text-align: center; color: #666;'>No participants found</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <p>🏃‍♂️ Nasha Mukht Bharat RUN - Organized by Wakeup Humanity Organization</p>
            <p>Last updated: <?php echo date('d M Y, H:i:s'); ?></p>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(function() {
            location.reload();
        }, 30000);
        
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.stat-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        });
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    </script>
</body>
</html>

<?php
$conn->close();
?>