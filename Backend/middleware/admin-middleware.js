// middleware/admin-middleware.js
const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden - Invalid token' });
        }

        if (!user.is_admin) {
            return res.status(403).json({ error: 'Forbidden - Admin access required' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateAdmin;