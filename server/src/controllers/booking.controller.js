const db = require('../config/db');
const { error, success } = require('../utils/response');

/**
 * Đăng ký đặt lịch hẹn đàm đạo trà & thăm xưởng nghệ nhân
 * POST /api/visit-bookings
 */
const createBooking = async (req, res, next) => {
  try {
    const { artisanId, fullName, phone, email, visitDate, timeSlot, purpose, note } = req.body;

    const details = [];
    if (!artisanId) details.push({ field: 'artisanId', issue: 'Vui lòng chọn nghệ nhân muốn thăm xưởng' });
    if (!fullName || fullName.trim() === '') details.push({ field: 'fullName', issue: 'Họ và tên không được để trống' });
    if (!phone || phone.trim() === '') details.push({ field: 'phone', issue: 'Số điện thoại không được để trống' });
    if (!visitDate) details.push({ field: 'visitDate', issue: 'Ngày hẹn thăm xưởng không được để trống' });
    if (!timeSlot) details.push({ field: 'timeSlot', issue: 'Khung giờ hẹn không được để trống' });
    if (!purpose) details.push({ field: 'purpose', issue: 'Mục đích chuyến thăm không được để trống' });

    if (details.length > 0) {
      return error(res, 400, 'BAD_REQUEST', 'Dữ liệu đặt hẹn không hợp lệ', details);
    }

    // Kiểm tra nghệ nhân tồn tại
    const artisanRes = await db.query(
      `SELECT id, name, visit_lead_time_hours, visit_open_days, visit_max_guests 
       FROM artisans WHERE id = $1`,
      [artisanId]
    );

    if (artisanRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy nghệ nhân với ID ${artisanId}`);
    }

    const artisan = artisanRes.rows[0];
    const targetDate = new Date(visitDate);
    const now = new Date();

    // Ràng buộc thời gian đặt trước (lead time)
    const minHours = artisan.visit_lead_time_hours || 24;
    const diffHours = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < minHours - 24) {
      // Cho phép linh hoạt nếu cùng ngày nhưng khuyến cáo đặt trước
    }

    const userId = req.user ? req.user.id : null;

    // Chuẩn hóa time_slot theo constraint: 'morning' | 'afternoon'
    let normalizedSlot = 'morning';
    if (timeSlot) {
      const lower = timeSlot.toLowerCase();
      if (lower.includes('afternoon') || lower.includes('chiều') || lower.includes('pm')) {
        normalizedSlot = 'afternoon';
      } else if (/^\d{1,2}:\d{2}/.test(timeSlot)) {
        const hour = parseInt(timeSlot.split(':')[0], 10);
        normalizedSlot = hour >= 12 ? 'afternoon' : 'morning';
      } else if (lower.includes('morning') || lower.includes('sáng') || lower.includes('am')) {
        normalizedSlot = 'morning';
      }
    }

    const insertSql = `
      INSERT INTO visit_bookings (
        artisan_id, user_id, full_name, phone, email,
        visit_date, time_slot, purpose, note, status
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, 'pending'
      ) RETURNING
        id,
        artisan_id AS "artisanId",
        user_id AS "userId",
        full_name AS "fullName",
        phone,
        email,
        to_char(visit_date, 'YYYY-MM-DD') AS "visitDate",
        time_slot AS "timeSlot",
        purpose,
        note,
        status,
        created_at AS "createdAt"
    `;

    const result = await db.query(insertSql, [
      artisanId,
      userId,
      fullName.trim(),
      phone.trim(),
      email ? email.trim().toLowerCase() : null,
      visitDate,
      normalizedSlot,
      purpose,
      note || null,
    ]);

    const bookingData = result.rows[0];
    bookingData.artisanName = artisan.name;

    return res.status(201).json({
      success: true,
      message: 'Đăng ký đặt lịch hẹn thành công. Phiếu hẹn đang ở trạng thái pending chờ xác nhận.',
      data: bookingData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lấy danh sách phiếu hẹn thăm xưởng
 * GET /api/visit-bookings
 * - User: Chỉ xem phiếu hẹn của chính mình
 * - Admin / Editor: Xem tất cả hệ thống (nếu all=true), lọc theo nghệ nhân, trạng thái
 */
const getBookings = async (req, res, next) => {
  try {
    const { all = 'false', artisanId, status = 'all', page = 1, limit = 20 } = req.query;

    const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'editor');
    const seeAll = isPrivileged && (all === 'true' || all === true);

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const values = [];

    // Phân quyền: Nếu không phải Admin/Editor hoặc không truyền all=true, bắt buộc lọc theo user_id
    if (!seeAll) {
      values.push(req.user.id);
      conditions.push(`vb.user_id = $${values.length}`);
    } else {
      // Admin/Editor có thể lọc theo artisanId
      if (artisanId) {
        values.push(parseInt(artisanId, 10));
        conditions.push(`vb.artisan_id = $${values.length}`);
      }
    }

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`vb.status = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*)::int AS count FROM visit_bookings vb ${whereClause}`;
    const countRes = await db.query(countSql, values);
    const totalItems = countRes.rows[0].count;

    values.push(limitNum);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const dataSql = `
      SELECT
        vb.id,
        vb.artisan_id AS "artisanId",
        a.name AS "artisanName",
        a.avatar_url AS "artisanAvatar",
        vb.user_id AS "userId",
        vb.full_name AS "fullName",
        vb.phone,
        vb.email,
        to_char(vb.visit_date, 'YYYY-MM-DD') AS "visitDate",
        vb.time_slot AS "timeSlot",
        vb.purpose,
        vb.note,
        vb.admin_note AS "adminNote",
        vb.status,
        vb.created_at AS "createdAt",
        vb.updated_at AS "updatedAt"
      FROM visit_bookings vb
      LEFT JOIN artisans a ON vb.artisan_id = a.id
      ${whereClause}
      ORDER BY vb.visit_date DESC, vb.id DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const dataRes = await db.query(dataSql, values);
    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: dataRes.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [Admin/Editor] Cập nhật trạng thái phiếu hẹn thăm xưởng
 * PATCH /api/visit-bookings/:id/status
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const allowedStatuses = ['confirmed', 'cancelled', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return error(res, 400, 'BAD_REQUEST', `Trạng thái không hợp lệ. Cho phép: [${allowedStatuses.join(', ')}]`);
    }

    const checkRes = await db.query('SELECT id FROM visit_bookings WHERE id = $1', [id]);
    if (checkRes.rowCount === 0) {
      return error(res, 404, 'NOT_FOUND', `Không tìm thấy phiếu hẹn với ID ${id}`);
    }

    const updates = ['status = $1', 'updated_at = NOW()'];
    const values = [status];

    if (adminNote !== undefined) {
      values.push(adminNote);
      updates.push(`admin_note = $${values.length}`);
    }

    values.push(id);
    const updateSql = `
      UPDATE visit_bookings
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING
        id,
        artisan_id AS "artisanId",
        user_id AS "userId",
        full_name AS "fullName",
        phone,
        email,
        to_char(visit_date, 'YYYY-MM-DD') AS "visitDate",
        time_slot AS "timeSlot",
        purpose,
        note,
        admin_note AS "adminNote",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await db.query(updateSql, values);
    const booking = result.rows[0];

    // Lấy thêm tên nghệ nhân
    const artisanRes = await db.query('SELECT name FROM artisans WHERE id = $1', [booking.artisanId]);
    if (artisanRes.rowCount > 0) {
      booking.artisanName = artisanRes.rows[0].name;
    }

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái phiếu hẹn sang ${status}`,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
