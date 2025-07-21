// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const bookRoutes = require('./routes/bookRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { protect } = require('./middleware/authMiddleware');

// Connect to database
connectDB();

app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow cookies to be sent (if you were using sessions/cookies)
    optionsSuccessStatus: 204 // Respond with 204 for preflight OPTIONS requests
}));

// Middleware to parse JSON
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRoutes); 

// Protected Book Routes
app.use('/api/books', bookRoutes);

// --- Example of a Protected Route (for testing purposes) ---
// You can remove this after testing, or keep it as a placeholder
app.get('/api/protected', protect, (req, res) => {
    // If we reach here, the user is authenticated, and req.user is available
    res.json({
        message: 'You accessed a protected route!',
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
});
// -------------------------------------------------------------

// Error Handling Middleware (MUST be after all routes)
app.use(notFound);
app.use(errorHandler);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
