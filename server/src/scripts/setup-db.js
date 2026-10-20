const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function setup() {
  const password = process.argv[2] || process.env.DB_PASSWORD;
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const user = process.env.DB_USER || 'postgres';
  const targetDbName = process.env.DB_NAME || 'craftroots';

  if (!password && password !== '') {
    console.error('❌ Vui lòng cung cấp mật khẩu:');
    console.error('   Cách 1: node server/src/scripts/setup-db.js <mat_khau>');
    console.error('   Cách 2: Cấu hình DB_PASSWORD trong file server/.env');
    process.exit(1);
  }

  console.log('='.repeat(70));
  console.log(`🚀 KHỞI TẠO CSDL POSTGRES CHO CRAFTROOTS (${targetDbName})`);
  console.log('='.repeat(70));

  // 1. Kết nối vào database mặc định 'postgres' để kiểm tra / tạo database đích
  console.log(`📡 Đang kết nối đến PostgreSQL server (${host}:${port}) với tài khoản "${user}"...`);
  const adminClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await adminClient.connect();
    console.log('✅ Xác thực tài khoản postgres thành công!');
  } catch (err) {
    console.error('❌ Không thể kết nối đến PostgreSQL:', err.message);
    await adminClient.end().catch(() => {});
    process.exit(1);
  }

  try {
    const dbCheck = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDbName]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`⚙️  Database "${targetDbName}" chưa tồn tại. Đang tạo mới...`);
      await adminClient.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Đã tạo database "${targetDbName}" thành công!`);
    } else {
      console.log(`ℹ️  Database "${targetDbName}" đã tồn tại.`);
    }
  } finally {
    await adminClient.end();
  }

  // 2. Kết nối vào database đích
  console.log(`📡 Đang kết nối đến database "${targetDbName}"...`);
  const dbClient = new Client({
    host,
    port,
    user,
    password,
    database: targetDbName,
    connectionTimeoutMillis: 5000,
  });

  await dbClient.connect();
  console.log(`✅ Kết nối thành công đến database "${targetDbName}"!`);

  // 3. Thực thi schema.sql
  const schemaPath = path.resolve(__dirname, '../../../db/schema.sql');
  console.log(`📄 Đang nạp cấu trúc bảng từ: ${schemaPath}...`);
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await dbClient.query(schemaSql);
  console.log('✅ Đã tạo cấu trúc 22 bảng thành công!');

  // 4. Thực thi seed.sql
  const seedPath = path.resolve(__dirname, '../../../db/seed.sql');
  console.log(`🌱 Đang nạp dữ liệu mẫu từ: ${seedPath}...`);
  const seedSql = fs.readFileSync(seedPath, 'utf8');
  await dbClient.query(seedSql);
  console.log('✅ Đã nạp toàn bộ dữ liệu hạt giống thành công!');

  // 5. Kiểm tra kết quả
  const catCount = await dbClient.query('SELECT COUNT(*)::int as count FROM craft_categories');
  const craftCount = await dbClient.query('SELECT COUNT(*)::int as count FROM crafts');
  const artisanCount = await dbClient.query('SELECT COUNT(*)::int as count FROM artisans');

  console.log('-'.repeat(70));
  console.log('📊 KẾT QUẢ KHỞI TẠO:');
  console.log(`   - Danh mục sản phẩm (craft_categories) : ${catCount.rows[0].count} danh mục`);
  console.log(`   - Tác phẩm / Sản phẩm (crafts)         : ${craftCount.rows[0].count} sản phẩm`);
  console.log(`   - Nghệ nhân di sản (artisans)          : ${artisanCount.rows[0].count} nghệ nhân`);
  console.log('-'.repeat(70));

  await dbClient.end();

  // 6. Tự động ghi/cập nhật file server/.env nếu chưa có
  const envPath = path.resolve(__dirname, '../../.env');
  const envContent = [
    'PORT=5000',
    'NODE_ENV=development',
    '',
    '# PostgreSQL Connection Configuration',
    `DB_HOST=${host}`,
    `DB_PORT=${port}`,
    `DB_NAME=${targetDbName}`,
    `DB_USER=${user}`,
    `DB_PASSWORD=${password}`,
    '',
    '# JWT Authentication',
    'JWT_SECRET=super_secret_craftroots_jwt_key_2026_dev_env_minimum_32_chars!',
    'JWT_EXPIRES_IN=1d',
    '',
    '# CORS Allowed Origin',
    'CORS_ORIGIN=http://localhost:5173',
    '',
  ].join('\n');

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`💾 Đã tạo/cập nhật file cấu hình: ${envPath}`);
  console.log('🎉 HOÀN TẤT TOÀN BỘ CSDL! Hãy tải lại trang web để xem danh mục sản phẩm.');
  console.log('='.repeat(70));
}

setup().catch((err) => {
  console.error('❌ Lỗi thiết lập CSDL:', err);
  process.exit(1);
});
