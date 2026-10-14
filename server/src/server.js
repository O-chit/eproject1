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
    const dbStatus = await testConnection();
    if (dbStatus && dbStatus.connected) {
      console.log(`✅ [Database] Kết nối PostgreSQL thành công (DB: ${dbStatus.database})`);
    } else {
      console.warn(`⚠️ [Database Warning] Chưa thể kết nối PostgreSQL: ${dbStatus?.error || 'Connection failed'}`);
      console.warn('👉 Vui lòng kiểm tra cấu hình file .env và đảm bảo dịch vụ PostgreSQL đang chạy.');
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
        try {
          await pool.end();
        } catch (_) {}
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

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
