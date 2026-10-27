const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security & Parsing Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost') || origin === env.corsOrigin) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Demo Assets
app.use('/demo', express.static(path.resolve(__dirname, '../../demo')));

// Root API Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CraftRoots REST API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Toàn bộ các API phân hệ gắn tiền tố /api (bao gồm /api/artisans)
app.use('/api', routes);

// 404 & Centralized Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
