// server.js
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');



// Import routes
const authRoutes = require('./routes/auth-routes');
const eventsRoutes = require('./routes/events-routes');
const timeTrackingRoutes = require('./routes/timeTracking-routes');
// const filesRoutes = require('./routes/files-routes');
const chatRoutes = require('./routes/chat-routes');
const projectRoutes = require('./routes/project-routes');
const feedRoutes = require('./routes/feed-routes');
const usersRoutes = require('./routes/users-routes');
const approvalsRoutes = require('./routes/approvals-routes');
const attendanceRoutes = require('./routes/attendance-routes');
const driveRoutes = require('./routes/drive-routes');
const projectsRoutes = require('./routes/projects-routes');
const userManagementRoutes = require('./routes/user-management-routes');


// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Import database connection (this will establish the connection)
require('./config/db');

// Routes
app.use('/', authRoutes);                 // Auth routes at root level
app.use('/api', eventsRoutes);     // Events routes
app.use('/api/timers', timeTrackingRoutes); // Time tracking routes
// app.use('/api', filesRoutes);            // File management(user admin) routes
app.use('/api/chat', chatRoutes);          // for the chat 
app.use('/api', projectRoutes);          // for scrumboard
app.use('/api', feedRoutes);            // for feed 
app.use('/api', usersRoutes);            // user routes for feed 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Add this line to serve static files
app.use('/api/approvals', approvalsRoutes);
app.use('/api/attendance', attendanceRoutes); 
app.use('/api/drive', driveRoutes); // for the drive files 
app.use('/api/project_task', projectsRoutes);  // ✅ Mount at correct base path // for projects in task 
app.use('/api/user-management', userManagementRoutes); // Admin user management


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));