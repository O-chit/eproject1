const env = require('./config/env');
const { pool, testConnection } = require('./config/db');
const app = require('./app');

// ==========================================
// 4. SERVER INITIALIZATION
// ==========================================
const startServer = async () => {
  try {
    // Kiểm tra kết nối CSDL PostgreSQL
    const dbHealth = await testConnection();
    if (dbHealth && dbHealth.connected) {
      console.log(`✅ [Database] Kết nối PostgreSQL thành công (DB: ${dbHealth.database})`);
    } else {
      console.warn(`⚠️ [Database] Cảnh báo kết nối CSDL: ${dbHealth?.error || 'Không xác định'} (Server vẫn khởi chạy)`);
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
