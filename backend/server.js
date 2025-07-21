// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRoutes); // All routes in authRoutes.js will be prefixed with /api/auth

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
