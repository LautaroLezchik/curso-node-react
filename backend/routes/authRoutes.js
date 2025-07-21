const express = require('express');
const router = express.Router(); // Create an Express router
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // For creating JWTs
const asyncHandler = require('express-async-handler'); // Simple wrapper for async express route handlers
// You might need to install express-async-handler: npm install express-async-handler

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please enter all fields');
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400);
            throw new Error('User with that email or username already exists');
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password, // Password will be hashed by the pre-save hook in User model
        });

        if (user) {
            res.status(201).json({ // 201 status for successful creation
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            res.status(400);
            throw new Error('Please enter all fields');
        }

        // Check for user by email, and explicitly select password to compare
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401); // 401 Unauthorized
            throw new Error('Invalid credentials');
        }

        // Compare entered password with hashed password
        const isMatch = await user.matchPassword(password); // Using the method defined in User model

        if (isMatch) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    })
);

module.exports = router;