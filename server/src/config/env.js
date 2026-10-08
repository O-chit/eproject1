const path = require('path');
const dotenv = require('dotenv');

// Ưu tiên nạp từ server/.env, nếu không có thì tìm ở root workspace
const serverEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../../.env');

const result = dotenv.config({ path: serverEnvPath });
if (result.error) {
  dotenv.config({ path: rootEnvPath });
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Cấu hình Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'craftroots',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    connectionString: process.env.DATABASE_URL,
    max: 20, // Số kết nối tối đa trong Pool
    idleTimeoutMillis: 30000, // Đóng client nhàn rỗi sau 30s
    connectionTimeoutMillis: 5000, // Timeout kết nối 5s
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'craftroots_default_secret_key_change_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
