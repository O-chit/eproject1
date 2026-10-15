const db = require('../config/db');
const { error, success } = require('../utils/response');

/**
 * Gửi tin nhắn liên hệ từ khách truy cập
 * POST /api/contact
 */
const submitContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, topic = 'other', subject, message } = req.body;

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

    const userId = req.user ? req.user.id : null;

    const sql = `
      INSERT INTO contact_messages (user_id, full_name, email, phone, topic, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread')
      RETURNING id, full_name AS "fullName", email, phone, topic, subject, message, status, created_at AS "createdAt"
    `;

    const result = await db.query(sql, [
      userId,
      fullName.trim(),
      email.trim().toLowerCase(),
      phone || null,
      topic,
      subject || null,
      message.trim(),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Gửi tin nhắn liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [Admin/Editor] Lấy danh sách tin nhắn liên hệ từ khách truy cập
 * GET /api/contact/messages
 */
const getContactMessages = async (req, res, next) => {
  try {
    const { status = 'all', topic = 'all', page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const values = [];

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (topic && topic !== 'all') {
      values.push(topic);
      conditions.push(`topic = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Lấy thống kê số lượng unread, read, replied
    const statsSql = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'unread' THEN 1 END)::int AS "unreadCount",
        COUNT(CASE WHEN status = 'read' THEN 1 END)::int AS "readCount",
        COUNT(CASE WHEN status = 'replied' THEN 1 END)::int AS "repliedCount"
      FROM contact_messages
    `;
    const statsRes = await db.query(statsSql);
    const summary = statsRes.rows[0];

    // Đếm số lượng theo bộ lọc
    const countSql = `SELECT COUNT(*)::int AS count FROM contact_messages ${whereClause}`;
    const countRes = await db.query(countSql, values);
    const totalFiltered = countRes.rows[0].count;

    values.push(limitNum);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const dataSql = `
      SELECT
        id,
        user_id AS "userId",
        full_name AS "fullName",
        email,
        phone,
        topic,
        subject,
        message,
        status,
        admin_notes AS "adminNotes",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM contact_messages
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const dataRes = await db.query(dataSql, values);
    const totalPages = Math.ceil(totalFiltered / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: dataRes.rows,
      summary,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: totalFiltered,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [Admin/Editor] Đổi trạng thái tin nhắn liên hệ
 * PATCH /api/contact/messages/:id/status
 */
const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowedStatuses = ['unread', 'read', 'replied'];
    if (!status || !allowedStatuses.includes(status)) {
      return error(res, 400, 'BAD_REQUEST', `Trạng thái không hợp lệ. Cho phép: [${allowedStatuses.join(', ')}]`);
    }

    const checkRes = await db.query('SELECT id FROM contact_messages WHERE id = $1', [id]);
    if (checkRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy tin nhắn với ID ${id}`);
    }

    const updates = ['status = $1', 'updated_at = NOW()'];
    const values = [status];

    if (adminNotes !== undefined) {
      values.push(adminNotes);
      updates.push(`admin_notes = $${values.length}`);
    }

    values.push(id);
    const updateSql = `
      UPDATE contact_messages
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING
        id,
        user_id AS "userId",
        full_name AS "fullName",
        email,
        phone,
        topic,
        subject,
        message,
        status,
        admin_notes AS "adminNotes",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await db.query(updateSql, values);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái tin nhắn thành công',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContact,
  getContactMessages,
  updateContactMessageStatus,
};
