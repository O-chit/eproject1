const crypto = require('crypto');
const { success, error } = require('../utils/response');
const db = require('../config/db');
const { processChatMessage, checkOllamaHealth } = require('../services/aiChat.service');

const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

/**
 * Kiểm tra quyền truy cập phiên trò chuyện.
 * - Phiên đã gắn user: chỉ chủ sở hữu (hoặc admin) được truy cập.
 * - Phiên khách (user_id NULL): ai giữ sessionId (chuỗi ngẫu nhiên khó đoán) được truy cập.
 * @returns {Promise<{ok: boolean, status?: number, code?: string, message?: string, exists?: boolean}>}
 */
const checkSessionAccess = async (sessionId, user) => {
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return { ok: false, status: 400, code: 'BAD_REQUEST', message: 'Mã phiên trò chuyện không hợp lệ.' };
  }
  const res = await db.query('SELECT user_id FROM chat_sessions WHERE id = $1', [sessionId]);
  if (res.rowCount === 0) return { ok: true, exists: false };

  const ownerId = res.rows[0].user_id;
  if (ownerId && (!user || (user.id !== ownerId && user.role !== 'admin'))) {
    return { ok: false, status: 403, code: 'FORBIDDEN', message: 'Bạn không có quyền truy cập phiên trò chuyện này.' };
  }
  return { ok: true, exists: true };
};

/**
 * Gửi tin nhắn đến AI Chatbot
 * POST /api/ai/chat
 */
const chat = async (req, res, next) => {
  try {
    const { sessionId, message, pageContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return error(res, 400, 'BAD_REQUEST', 'Nội dung tin nhắn không được để trống.');
    }
    if (message.length > 4000) {
      return error(res, 400, 'BAD_REQUEST', 'Tin nhắn quá dài (tối đa 4000 ký tự).');
    }
    if (sessionId !== undefined && sessionId !== null && (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId))) {
      return error(res, 400, 'BAD_REQUEST', 'Mã phiên trò chuyện không hợp lệ.');
    }

    const currentSessionId = sessionId || `session_${crypto.randomUUID().replace(/-/g, '')}`;
    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role : 'guest';
    const userEmail = req.user ? req.user.email : null;
    const userName = req.user ? req.user.fullName : null;

    const result = await processChatMessage({
      sessionId: currentSessionId,
      userId,
      userRole,
      userEmail,
      userName,
      message: message.trim(),
      pageContext: pageContext && typeof pageContext === 'object' ? pageContext : {},
    });

    return success(res, result, 200);
  } catch (err) {
    console.error('Lỗi controller AI Chat:', err);
    return next(err);
  }
};

/**
 * Lấy lịch sử phiên trò chuyện
 * GET /api/ai/sessions/:sessionId/history
 */
const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const access = await checkSessionAccess(sessionId, req.user);
    if (!access.ok) return error(res, access.status, access.code, access.message);
    if (!access.exists) return success(res, { sessionId, messages: [] });

    const messagesRes = await db.query(
      `SELECT id, sender_role AS role, content, rich_cards AS "richCards", created_at AS "createdAt"
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId]
    );

    return success(res, {
      sessionId,
      messages: messagesRes.rows,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Xóa lịch sử phiên trò chuyện
 * DELETE /api/ai/sessions/:sessionId
 */
const deleteHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const access = await checkSessionAccess(sessionId, req.user);
    if (!access.ok) return error(res, access.status, access.code, access.message);

    if (access.exists) {
      await db.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);
    }
    return success(res, { message: 'Đã xóa toàn bộ lịch sử cuộc trò chuyện.' });
  } catch (err) {
    return next(err);
  }
};

/**
 * Kiểm tra trạng thái hệ thống AI (Ollama Local)
 * GET /api/ai/status
 */
const getStatus = async (req, res, next) => {
  try {
    const health = await checkOllamaHealth();
    return success(res, {
      provider: 'ollama',
      available: health.available,
      models: health.models || [],
      recommendedModel: process.env.LOCAL_AI_MODEL || 'qwen2.5:3b',
      message: health.available
        ? 'Dịch vụ Ollama AI Local đang chạy sẵn sàng!'
        : 'Dịch vụ Ollama AI chưa khởi động. Hệ thống đang sử dụng bộ tra cứu CSDL Di sản thông minh.',
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  chat,
  getHistory,
  deleteHistory,
  getStatus,
};
