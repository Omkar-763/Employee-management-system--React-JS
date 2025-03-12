const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Default MySQL password in XAMPP
  database: "test_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed!", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

const SECRET_KEY = "your_secret_key"; // Change this to a secure key

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin) return res.status(403).json({ error: "Access denied. Not an admin." });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// **Sign Up (Register)**
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user is the first one to register (admin)
  const checkAdminQuery = "SELECT COUNT(*) AS count FROM users";
  db.query(checkAdminQuery, async (err, results) => {
    if (err) return res.json({ error: err.message });

    const isFirstUser = results[0].count === 0;
    const isAdmin = isFirstUser; // First user is admin
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, isAdmin], (err, result) => {
      if (err) return res.json({ error: err.message });
      res.json({ message: "User registered successfully", isAdmin });
    });
  });
});

// **Sign In (Login)**
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.is_admin }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, isAdmin: user.is_admin });
  });
});

// **Promote a User to Admin** (Admin-only route)
app.post("/promote-to-admin", isAdmin, (req, res) => {
  const { userId } = req.body;

  const sql = "UPDATE users SET is_admin = TRUE WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.json({ error: err.message });
    res.json({ message: "User promoted to admin successfully" });
  });
});

// **Admin-Only Route Example**
app.get("/admin-only-route", isAdmin, (req, res) => {
  res.json({ message: "This is an admin-only route" });
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Database Connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "", // Default MySQL password in XAMPP
//   database: "test_db",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database Connection Failed!", err);
//   } else {
//     console.log("Connected to MySQL Database");
//   }
// });

// const SECRET_KEY = "your_secret_key"; // Change this to a secure key

// // Middleware to check if the user is an admin
// const isAdmin = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     if (!decoded.isAdmin) return res.status(403).json({ error: "Access denied. Not an admin." });
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: "Invalid token." });
//   }
// };

// // **Get All Users** (Admin-only)
// app.get("/api/users", isAdmin, (req, res) => {
//   const sql = "SELECT id, name, email, is_admin FROM users";
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

// // **Promote a User to Admin** (Admin-only)
// app.put("/api/users/:id/make-admin", isAdmin, (req, res) => {
//   const userId = req.params.id;

//   const sql = "UPDATE users SET is_admin = TRUE WHERE id = ?";
//   db.query(sql, [userId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    
//     res.json({ message: "User promoted to admin successfully" });
//   });
// });

// // Start Server
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
