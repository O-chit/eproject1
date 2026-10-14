const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Ký mã thông báo JWT
 * @param {object} payload - Dữ liệu đưa vào JWT (sub, email, role, ...)
 * @returns {string} Token JWT
 */
const signToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

/**
 * Xác thực và giải mã mã thông báo JWT
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

module.exports = {
  signToken,
  verifyToken,
};
