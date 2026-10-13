const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CraftRoots REST API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler cho các API không tồn tại
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} không tồn tại`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Lỗi hệ thống nội bộ',
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
