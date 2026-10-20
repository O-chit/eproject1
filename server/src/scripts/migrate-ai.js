const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function migrateAI() {
  try {
    const migrationSql = fs.readFileSync(
      path.resolve(__dirname, '../../../db/migrations/002_add_ai_chat_tables.sql'),
      'utf8'
    );
    console.log('🔄 Đang áp dụng migration AI Chatbot (chat_sessions, chat_messages)...');
    await pool.query(migrationSql);
    console.log('✅ Migration AI Chatbot thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi migration AI Chatbot:', err.message);
    process.exit(1);
  }
}

migrateAI();
