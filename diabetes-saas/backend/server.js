require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.js');

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Performance middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Diabetes SaaS Backend running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});

