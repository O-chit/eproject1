const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/db');

const PORT = env.port || 5000;

async function startServer() {
  // Kiểm tra kết nối CSDL khi khởi động máy chủ
  const dbHealth = await testConnection();
  if (dbHealth.connected) {
    console.log(`[Database] Kết nối PostgreSQL thành công (DB: ${dbHealth.database})`);
  } else {
    console.warn(`[Database] Chưa kết nối CSDL: ${dbHealth.error} (vẫn chạy server API)`);
  }

  const server = app.listen(PORT, () => {
    console.log(`[Backend API] Đang chạy ngầm tại: http://localhost:${PORT}`);
  });

  const shutdown = () => {
    console.log('\n[Backend API] Đang dừng máy chủ...');
    server.close(() => {
      console.log('[Backend API] Máy chủ đã dừng an toàn.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((err) => {
  console.error('[Backend API Error]:', err);
  process.exit(1);
});
