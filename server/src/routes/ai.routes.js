const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { optionalAuthenticate } = require('../middleware/authenticate');

// 1. Kiểm tra trạng thái AI (Ollama Local)
router.get('/status', aiController.getStatus);

// 2. Gửi tin nhắn và nhận phản hồi từ AI (kèm danh tính nếu đã đăng nhập)
router.post('/chat', optionalAuthenticate, aiController.chat);

// 3. Lịch sử cuộc trò chuyện
router.get('/sessions/:sessionId/history', aiController.getHistory);

// 4. Xóa phiên trò chuyện
router.delete('/sessions/:sessionId', aiController.deleteHistory);

module.exports = router;

