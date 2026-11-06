const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(helmet({ crossOriginResourcePolicy: false }));

/**
 * Kiểm tra origin có được phép gọi API hay không.
 * - Luôn cho phép các origin trong CORS_ORIGIN / CLIENT_ORIGIN (phân tách bằng dấu phẩy).
 * - Môi trường development: cho phép thêm mọi cổng của localhost / 127.0.0.1.
 */
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl, Postman, server-to-server
  if (env.allowedOrigins.includes(origin)) return true;
  if (env.nodeEnv !== 'production') {
    try {
      const { hostname } = new URL(origin);
      return hostname === 'localhost' || hostname === '127.0.0.1';
    } catch {
      return false;
    }
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve demo assets statically
app.use('/demo', express.static(path.resolve(__dirname, '../../demo')));

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

// Toàn bộ API gắn tiền tố /api theo OpenAPI Contract
app.use('/api', routes);

// ==========================================
// 3. ERROR HANDLING
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
