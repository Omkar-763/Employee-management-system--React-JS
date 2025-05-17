// Enhanced user-routes.js with comprehensive debugging
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth-middleware');

// DEBUG ENDPOINT: Test database connection
router.get('employee_management', async (req, res) => {
  try {
    const [result] = await db.promise().query('SELECT 1 as db_connection_test');
    return res.json({
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// DEBUG ENDPOINT: Test authentication
router.get('/test-auth', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    message: 'Authentication successful',
    user: {
      id: req.user.id,
      // Don't include sensitive info
      tokenPayload: JSON.stringify(req.user)
    }
  });
});

// Get all users (admin only) - WITH ENHANCED DEBUGGING
router.get('/', async (req, res) => {
  console.log('=== GET /users ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Check if we have an auth header before hitting the middleware
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('Auth header missing in request');
  } else {
    console.log('Auth header present:', authHeader.substring(0, 15) + '...');
  }

  // Continue with normal flow
  authenticateToken(req, res, async () => {
    console.log('Auth middleware passed, user:', req.user);
    
    try {
      // Check if req.user exists
      if (!req.user || !req.user.id) {
        console.log('Authentication succeeded but user data missing');
        return res.status(401).json({
          success: false,
          error: 'Authentication failed: Missing user data'
        });
      }
      
      console.log('Checking admin status for user ID:', req.user.id);
      
      // Verify requesting user exists and is admin
      try {
        const [users] = await db.promise().query(
          'SELECT id, is_admin FROM users WHERE id = ? AND deleted_at IS NULL', 
          [req.user.id]
        );
        
        console.log('Admin check query result:', users);
        
        if (!users || users.length === 0) {
          console.log('User not found in database');
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        if (!users[0].is_admin) {
          console.log('User is not an admin');
          return res.status(403).json({
            success: false,
            error: 'Admin privileges required'
          });
        }

        console.log('User is admin, proceeding to fetch all users');
        
        // Get all active users
        try {
          console.log('Executing query to get all users');
          const [allUsers] = await db.promise().query(`
            SELECT 
              id, 
              name, 
              email, 
              is_admin, 
              DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM users 
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
          `);
          
          console.log(`Query successful, found ${allUsers.length} users`);
          return res.json({
            success: true,
            data: allUsers
          });
        } catch (queryError) {
          console.error('Error fetching all users:', queryError);
          return res.status(500).json({
            success: false,
            error: 'Database error when fetching users',
            details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
          });
        }
      } catch (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        return res.status(500).json({
          success: false,
          error: 'Database error when checking admin status',
          details: process.env.NODE_ENV === 'development' ? adminCheckError.message : undefined
        });
      }
    } catch (error) {
      console.error('Unexpected error in users route:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

// Update admin status
// router.put('/:id/admin', authenticateToken, async (req, res) => {
//   // [existing code for updating admin status]
// });

module.exports = router;