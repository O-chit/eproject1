const { Pool } = require('pg');
const env = require('./env');

// Khởi tạo Connection Pool theo chuẩn Postgres
const poolConfig = env.db.connectionString
  ? {
      connectionString: env.db.connectionString,
      max: env.db.max,
      idleTimeoutMillis: env.db.idleTimeoutMillis,
      connectionTimeoutMillis: env.db.connectionTimeoutMillis,
    }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password,
      max: env.db.max,
      idleTimeoutMillis: env.db.idleTimeoutMillis,
      connectionTimeoutMillis: env.db.connectionTimeoutMillis,
    };

const pool = new Pool(poolConfig);

// Lắng nghe sự kiện kết nối của Pool
pool.on('connect', () => {
  // Client mới vừa được tạo và nối vào pool thành công
});

pool.on('error', (err) => {
  console.error('[DB Error] Lỗi kết nối bất ngờ trên client rỗi:', err.message);
});

/**
 * Hàm truy vấn chuẩn hoá có đo lường thời gian thực thi (Performance Metric)
 * @param {string} text - Câu lệnh SQL
 * @param {Array} params - Tham số chống SQL Injection
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.nodeEnv === 'development' && duration > 100) {
      console.warn(`[Slow Query] ${duration}ms | SQL: ${text.slice(0, 100)}...`);
    }
    return res;
  } catch (error) {
    console.error(`[DB Query Error] SQL: ${text} | Error: ${error.message}`);
    throw error;
  }
};

/**
 * Hàm kiểm tra tình trạng kết nối DB (Health Check)
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT current_database() as db, version() as version, NOW() as current_time');
    client.release();
    return {
      connected: true,
      database: res.rows[0].db,
      version: res.rows[0].version,
      serverTime: res.rows[0].current_time,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};

module.exports = {
  pool,
  query,
  testConnection,
};
