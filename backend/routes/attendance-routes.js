// routes/attendance-routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth-middleware');

// Helper function to safely convert MySQL datetime to ISO string
const safeDateConvert = (mysqlDate) => {
  if (!mysqlDate || mysqlDate === '0000-00-00 00:00:00') {
    return null;
  }
  try {
    return new Date(mysqlDate).toISOString();
  } catch (e) {
    console.error('Error converting date:', mysqlDate, e);
    return null;
  }
};

// Get user's own attendance records
router.get('/my', authenticateToken, (req, res) => { 
    const userId = req.user.id;
    
    db.query(
        `SELECT 
            id,
            start_time,
            end_time,
            break_start_time,
            total_work_duration,
            total_break_duration,
            status,
            created_at
        FROM time_sessions
        WHERE user_id = ?
        ORDER BY created_at DESC`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Failed to fetch attendance records' 
                });
            }
            
            res.json({
                success: true,
                data: results.map(record => ({
                    ...record,
                    // Use safe conversion for all datetime fields
                    start_time: safeDateConvert(record.start_time),
                    end_time: safeDateConvert(record.end_time),
                    break_start_time: safeDateConvert(record.break_start_time),
                    created_at: safeDateConvert(record.created_at)
                }))
            });
        }
    );
});

module.exports = router;