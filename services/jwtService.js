const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../model/users');

const JWT_SECRET = "lms_backend";

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[0];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const decodeToken = async (req) => {
    try {
        const token = req.headers['authorization']?.split(' ')[0];
        const decoded = jwt.verify(token, JWT_SECRET);        
        return decoded;
    } catch (err) {
        console.error("Token verification failed:", err.message);
    }
}

const generateToken = (payload) => {
    try {
        if (!payload.userName) return res.send('userName is required');
        const options = { expiresIn: '1h' };
        const token = jwt.sign(payload, JWT_SECRET, options);
        return token;
    } catch (error) {
        console.error("Token generation failed:", error.message);
    }
}

module.exports = { decodeToken, authenticateToken, generateToken };