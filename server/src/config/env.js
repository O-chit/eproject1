const path = require('path');
const dotenv = require('dotenv');

// Ưu tiên nạp từ root .env, sau đó mới nạp server/.env
const rootEnvPath = path.resolve(__dirname, '../../../.env');
const serverEnvPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: serverEnvPath });

// Nếu DATABASE_URL còn chứa placeholder "your_db_password" thì bỏ qua, dùng cấu hình rời DB_*
const rawDatabaseUrl = process.env.DATABASE_URL;
const validConnectionString = (rawDatabaseUrl && !rawDatabaseUrl.includes('your_db_password') && !rawDatabaseUrl.includes('mật_khẩu'))
  ? rawDatabaseUrl
  : null;

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'craftroots_default_secret_key_change_in_prod_at_least_32_chars';

// Kiểm tra bảo mật môi trường production theo quy tắc nghiêm ngặt
if (nodeEnv === 'production') {
  const leakedKeys = [
    'super_secret_craftroots_jwt_key_2026_x!99',
    'craftroots_super_secret_jwt_key_2026_very_long_and_secure',
    'craftroots_default_secret_key_change_in_prod',
    'thay_bang_chuoi_bi_mat_dai_va_ngau_nhien',
  ];

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || leakedKeys.includes(process.env.JWT_SECRET)) {
    throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET trong môi trường production phải có độ dài tối thiểu 32 ký tự và không được trùng các chuỗi mẫu đã công bố trong tài liệu.');
  }
}

// Hỗ trợ nhiều origin phân tách bằng dấu phẩy
const rawOrigin = process.env.CLIENT_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigin.split(',').map((origin) => origin.trim()).filter(Boolean);

module.exports = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),

  // Cấu hình Database PostgreSQL
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'craftroots',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD ?? ''),
    connectionString: validConnectionString,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20, // Số kết nối tối đa trong Pool
    idleTimeoutMillis: 30000, // Đóng client nhàn rỗi sau 30s
    connectionTimeoutMillis: 5000, // Timeout kết nối 5s
  },

  // JWT
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  // CORS
  corsOrigin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  allowedOrigins,

  // Thư mục lưu trữ media/upload
  uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
};
