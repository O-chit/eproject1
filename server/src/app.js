const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép mọi request localhost hoặc từ CORS_ORIGIN
      if (!origin || origin.startsWith('http://localhost') || origin === env.corsOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Dev mode linh hoạt
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging trong môi trường phát triển
if (env.nodeEnv === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// ==========================================
// 2. ROOT & API ROUTES
// ==========================================
app.get('/', (req, res) => {
  res.json({
    name: 'CraftRoots RESTful API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/api/health',
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'CraftRoots REST API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Toàn bộ các API phân hệ gắn tiền tố /api
app.use('/api', routes);

// ==========================================
// 3. ERROR HANDLING
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
