const bcrypt = require('bcrypt');
const env = require('../config/env');

const SALT_ROUNDS = env.bcryptRounds || 10;

/**
 * Băm mật khẩu bằng thuật toán bcrypt
 * @param {string} password - Mật khẩu gốc
 * @returns {Promise<string>} Hash mật khẩu
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * So sánh mật khẩu gốc với hash lưu trong CSDL
 * @param {string} password - Mật khẩu người dùng nhập
 * @param {string} hash - Mật khẩu đã băm trong CSDL
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
