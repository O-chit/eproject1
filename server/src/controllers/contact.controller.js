const db = require('../config/db');
const { error } = require('../utils/response');

/**
 * Gửi tin nhắn liên hệ từ khách truy cập
 * POST /api/contact
 */
const submitContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    const details = [];
    if (!fullName || fullName.trim() === '') {
      details.push({ field: 'fullName', issue: 'Họ và tên không được để trống' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      details.push({ field: 'email', issue: 'Email không hợp lệ' });
    }
    if (!message || message.trim().length < 10) {
      details.push({ field: 'message', issue: 'Nội dung tin nhắn phải có ít nhất 10 ký tự' });
    }

    if (details.length > 0) {
      return error(res, 400, 'BAD_REQUEST', 'Lỗi kiểm tra dữ liệu đầu vào', details);
    }

    const sql = `
      INSERT INTO contact_messages (full_name, email, phone, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, 'unread')
    `;

    await db.query(sql, [
      fullName.trim(),
      email.trim().toLowerCase(),
      phone || null,
      subject || null,
      message.trim(),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Gửi tin nhắn liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContact,
};
