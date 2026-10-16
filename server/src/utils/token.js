const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Ký tạo JWT token từ thông tin người dùng
 * @param {object} payload - Dữ liệu đưa vào JWT { id/sub, email, role, ... }
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
  const tokenPayload = {
    ...payload,
    id: payload.id !== undefined ? payload.id : payload.sub,
    sub: payload.sub !== undefined ? payload.sub : payload.id,
  };
  return jwt.sign(tokenPayload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

const signToken = generateToken;

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
  signToken,
  verifyToken,
};
