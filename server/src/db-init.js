const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
const env = require('./config/env');

async function initializeDatabase() {
  console.log('🔄 Bắt đầu quy trình thiết lập cơ sở dữ liệu CraftRoots...');
  
  // 1. Kết nối vào database mặc định 'postgres' để kiểm tra và tạo database 'craftroots' nếu chưa có
  console.log(`🔍 Kiểm tra database "${env.db.database}" trên PostgreSQL...`);
  const adminConfig = env.db.connectionString
    ? { connectionString: env.db.connectionString.replace(/\/craftroots(\?.*)?$/, '/postgres$1') }
    : {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: 'postgres',
      };

  const adminClient = new Client(adminConfig);
  try {
    await adminClient.connect();
    const checkRes = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [env.db.database]
    );
    if (checkRes.rows.length === 0) {
      console.log(`📦 Database "${env.db.database}" chưa tồn tại. Đang tự động tạo...`);
      await adminClient.query(`CREATE DATABASE "${env.db.database}"`);
      console.log(`✅ Đã tạo database "${env.db.database}" thành công!`);
    } else {
      console.log(`✅ Database "${env.db.database}" đã tồn tại.`);
    }
  } catch (err) {
    console.warn(`⚠️ Kiểm tra database qua admin client: ${err.message}`);
  } finally {
    await adminClient.end().catch(() => {});
  }

  // 2. Kết nối tới database craftroots và thực thi schema + seed
  const { pool } = require('./config/db');

  try {
    const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
    const seedPath = path.resolve(__dirname, '../../db/seed.sql');

    if (!fs.existsSync(schemaPath) || !fs.existsSync(seedPath)) {
      throw new Error('Không tìm thấy file schema.sql hoặc seed.sql trong thư mục db/');
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('⏳ Đang khởi tạo Schema (Bảng, Chỉ mục, Khóa ngoại)...');
    await pool.query(schemaSql);
    console.log('✅ Khởi tạo Schema thành công!');

    console.log('⏳ Đang nạp dữ liệu mẫu (Seed Data)...');
    await pool.query(seedSql);
    console.log('✅ Nạp dữ liệu mẫu thành công!');

    console.log('🎉 Hoàn tất toàn bộ thiết lập cơ sở dữ liệu CraftRoots!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi khởi tạo CSDL:', err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
