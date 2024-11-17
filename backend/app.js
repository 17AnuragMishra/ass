const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');

// Initialize dotenv to use environment variables
dotenv.config();

// Generate a secure, random JWT secret
const JWT_SECRET = crypto.randomBytes(64).toString('hex');
console.log(`Generated JWT Secret: ${JWT_SECRET}`);

// Make the secret globally accessible
global.JWT_SECRET = JWT_SECRET;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(cors()); // Allow cross-origin requests

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/cars', carRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
