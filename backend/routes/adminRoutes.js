const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const Admin = require('../models/Admin');

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'Admin API is working 🚀' });
});

// Serve login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin-login.html'));
});

// Register admin (API)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if admin exists
        const adminExists = await Admin.findOne({ username });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create admin
        const admin = await Admin.create({ username, password });

        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for admin
        const admin = await Admin.findOne({ username }).select('+password');
        
        // Use a single, consistent check for invalid credentials
        if (!admin || !(await admin.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // If successful, send a JSON response with the token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: generateToken(admin._id)
        });

    } catch (error) {
        // Use a 500 status code for internal server errors
        console.error("Login server error:", error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// Serve dashboard
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Seed admin account
router.get('/seed', async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(400).json({ message: 'Admin account already exists' });
        }

        const admin = await Admin.create({
            username: 'admin',
            password: 'admin123'
        });

        res.status(201).json({
            message: 'Default admin account created successfully',
            _id: admin._id,
            username: admin.username
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// JWT generator
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = router;