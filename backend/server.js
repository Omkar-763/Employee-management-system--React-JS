// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth-routes');
const eventsRoutes = require('./routes/events-routes');
const timeTrackingRoutes = require('./routes/timeTracking-routes');
const filesRoutes = require('./routes/files-routes');
const userRoutes = require('./routes/user-routes');
const chatRoutes = require('./routes/chat-routes'); // New chat routes
// const approvalsRoutes = require('./routes/approvals-routes');// ... other routes ...
const attendanceRoutes = require('./routes/attendance-routes');
// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Import database connection (this will establish the connection)
require('./config/db');

// Routes
app.use('/', authRoutes);                 // Auth routes at root level
app.use('/api/events', eventsRoutes);     // Events routes
app.use('/api/timers', timeTrackingRoutes); // Time tracking routes
app.use('/api', filesRoutes);            // File management routes
app.use('/api/users', userRoutes);       // User management routes
app.use('/api/chat', chatRoutes);        // Chat routes
// app.use('/api/approvals', approvalsRoutes);// ... other route mounts ...
// Error handling middleware
app.use('/api/attendance', attendanceRoutes);//attendance routes

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));