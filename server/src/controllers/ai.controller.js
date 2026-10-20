const { success, error } = require('../utils/response');
const db = require('../config/db');
const { processChatMessage, checkOllamaHealth } = require('../services/aiChat.service');

/**
 * Gửi tin nhắn đến AI Chatbot
 * POST /api/ai/chat
 */
const chat = async (req, res, next) => {
  try {
    const { sessionId, message, pageContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return error(res, 'Nội dung tin nhắn không được để trống.', 400);
    }

    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = req.user ? req.user.id : null;

    const result = await processChatMessage({
      sessionId: currentSessionId,
      userId,
      message: message.trim(),
      pageContext: pageContext || {}
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

    const messagesRes = await db.query(
      `SELECT id, sender_role AS role, content, rich_cards AS "richCards", created_at AS "createdAt"
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId]
    );

    return success(res, {
      sessionId,
      messages: messagesRes.rows
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
    await db.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);
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
        : 'Dịch vụ Ollama AI chưa khởi động. Hệ thống đang sử dụng bộ tra cứu CSDL Di sản thông minh.'
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  chat,
  getHistory,
  deleteHistory,
  getStatus
};
