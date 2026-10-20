const app = require('./app');
const env = require('./config/env');
const { pool, testConnection } = require('./config/db');

// ==========================================
// SERVER INITIALIZATION & LIFECYCLE
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

    return server;
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
