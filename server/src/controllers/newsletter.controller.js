const db = require('../config/db');
const { error } = require('../utils/response');

/**
 * Đăng ký nhận bản tin di sản làng nghề hàng tháng
 * POST /api/newsletter
 */
const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(res, 400, 'BAD_REQUEST', 'Địa chỉ email không hợp lệ theo định dạng RFC 5322');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Kiểm tra trùng lặp email
    const checkRes = await db.query(
      'SELECT id FROM newsletter_subscribers WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (checkRes.rowCount > 0) {
      return error(res, 409, 'DUPLICATE_EMAIL', 'Email đã đăng ký nhận bản tin từ trước');
    }

    await db.query('INSERT INTO newsletter_subscribers (email) VALUES ($1)', [normalizedEmail]);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký nhận bản tin di sản thành công',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  subscribeNewsletter,
};
