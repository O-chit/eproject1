const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Ký tạo JWT token từ thông tin người dùng
 * @param {object} payload - Thông tin người dùng { id, email, role }
 * @returns {string} Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

/**
 * Xác thực và giải mã JWT token
 * @param {string} token
 * @returns {object} Payload đã giải mã
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
