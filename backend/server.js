require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection - UPDATE THESE VALUES TO MATCH YOUR DB
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Empty password as shown in your setup
  database: process.env.DB_NAME || 'test_db' // Your database name
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to your MySQL database');
});

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) throw err;
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user (first user becomes admin)
      db.query('SELECT COUNT(*) as count FROM users', (err, countResults) => {
        const isAdmin = countResults[0].count === 0;
        
        db.query(
          'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, isAdmin],
          (err, result) => {
            if (err) throw err;
            
            const token = jwt.sign(
              { id: result.insertId, email, isAdmin },
              SECRET_KEY,
              { expiresIn: '24h' }
            );
            
            res.status(201).json({
              message: 'User registered successfully',
              token,
              user: {
                id: result.insertId,
                name,
                email,
                isAdmin
              }
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin
      }
    });
  });
});

// Get user profile endpoint
app.get('/user-info', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    db.query(
      'SELECT id, name, email, is_admin FROM users WHERE id = ?',
      [decoded.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json(results[0]);
      }
    );
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));