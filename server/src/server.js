const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const { pool, testConnection } = require('./config/db');
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
      // Cho phép mọi request cục bộ hoặc đúng CORS_ORIGIN
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

// Logging đơn giản trong môi trường phát triển
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

// Toàn bộ API gắn tiền tố /api theo OpenAPI Contract
app.use('/api', routes);

// ==========================================
// 3. ERROR HANDLING
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// 4. SERVER INITIALIZATION
// ==========================================
const startServer = async () => {
  try {
    // Kiểm tra kết nối CSDL PostgreSQL
    const isDbConnected = await testConnection();
    if (!isDbConnected) {
      console.error('❌ Không thể kết nối cơ sở dữ liệu PostgreSQL. Vui lòng kiểm tra file .env');
      process.exit(1);
    }

    const server = app.listen(env.port, () => {
      console.log('======================================================================');
      console.log(`🚀 CraftRoots API Server đang chạy tại: http://localhost:${env.port}`);
      console.log(`📡 Base API URL: http://localhost:${env.port}/api`);
      console.log(`🩺 Health Check: http://localhost:${env.port}/api/health`);
      console.log(`🌱 Môi trường : ${env.nodeEnv}`);
      console.log('======================================================================');
    });

    // Graceful shutdown
    const handleShutdown = () => {
      console.log('\n🛑 Đang dừng server an toàn...');
      server.close(async () => {
        await pool.end();
        console.log('✅ Đã đóng kết nối CSDL và dừng server.');
        process.exit(0);
      });
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
