const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

/**
 * Đăng ký tài khoản người dùng mới
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    const details = [];
    if (!fullName || fullName.trim() === '') {
      details.push({ field: 'fullName', issue: 'Họ và tên không được để trống' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      details.push({ field: 'email', issue: 'Email không hợp lệ' });
    }
    if (!password || password.length < 8) {
      details.push({ field: 'password', issue: 'Mật khẩu phải chứa ít nhất 8 ký tự' });
    }

    if (details.length > 0) {
      return error(res, 400, 'BAD_REQUEST', 'Dữ liệu đăng ký không hợp lệ', details);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Kiểm tra trùng lặp email
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount > 0) {
      return error(res, 409, 'EMAIL_EXISTS', 'Email này đã tồn tại trong hệ thống');
    }

    // Băm mật khẩu bằng bcrypt (salt rounds = 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Lưu vào CSDL
    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, 'user', true)
      RETURNING id, full_name, email, role, avatar_url
    `;
    const result = await db.query(insertQuery, [fullName.trim(), normalizedEmail, passwordHash]);
    const userRow = result.rows[0];

    const userProfile = {
      id: userRow.id,
      fullName: userRow.full_name,
      email: userRow.email,
      role: userRow.role,
      avatarUrl: userRow.avatar_url,
    };

    // Ký JWT Token
    const token = generateToken({
      id: userProfile.id,
      email: userProfile.email,
      role: userProfile.role,
    });

    return res.status(201).json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Đăng nhập vào hệ thống
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, 'BAD_REQUEST', 'Vui lòng cung cấp đầy đủ email và mật khẩu');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Tìm kiếm user
    const result = await db.query(
      'SELECT id, full_name, email, password_hash, role, avatar_url, is_active FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rowCount === 0) {
      return error(res, 401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không chính xác');
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return error(res, 401, 'ACCOUNT_DEACTIVATED', 'Tài khoản của bạn đã bị tạm khóa');
    }

    // So sánh mật khẩu bằng bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, 401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không chính xác');
    }

    const userProfile = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url,
    };

    const token = generateToken({
      id: userProfile.id,
      email: userProfile.email,
      role: userProfile.role,
    });

    return res.status(200).json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy thông tin tài khoản người dùng hiện tại
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return success(res, req.user);
};

/**
 * Đổi mật khẩu tài khoản
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return error(res, 400, 'BAD_REQUEST', 'Vui lòng cung cấp đầy đủ mật khẩu hiện tại và mật khẩu mới');
    }

    if (newPassword.length < 8) {
      return error(res, 400, 'BAD_REQUEST', 'Mật khẩu mới phải có độ dài ít nhất 8 ký tự');
    }

    // Lấy password_hash hiện tại
    const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (result.rowCount === 0) {
      return error(res, 404, 'USER_NOT_FOUND', 'Người dùng không tồn tại');
    }

    const currentHash = result.rows[0].password_hash;
    const isMatch = await bcrypt.compare(currentPassword, currentHash);
    if (!isMatch) {
      return error(res, 400, 'INVALID_PASSWORD', 'Mật khẩu hiện tại không chính xác');
    }

    // Băm mật khẩu mới và cập nhật
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      newHash,
      req.user.id,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Cập nhật thông tin hồ sơ người dùng
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, avatarUrl } = req.body;

    const updates = [];
    const values = [];

    if (fullName !== undefined) {
      if (fullName.trim() === '') {
        return error(res, 400, 'BAD_REQUEST', 'Họ và tên không được để trống');
      }
      values.push(fullName.trim());
      updates.push(`full_name = $${values.length}`);
    }

    if (avatarUrl !== undefined) {
      values.push(avatarUrl);
      updates.push(`avatar_url = $${values.length}`);
    }

    if (updates.length === 0) {
      return error(res, 400, 'BAD_REQUEST', 'Không có thông tin nào được yêu cầu cập nhật');
    }

    values.push(req.user.id);
    const updateSql = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = NOW() 
      WHERE id = $${values.length} 
      RETURNING id, full_name AS "fullName", email, role, avatar_url AS "avatarUrl"
    `;

    const result = await db.query(updateSql, values);
    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  updateProfile,
};
