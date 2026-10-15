const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate, optionalAuthenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public / Authenticated User: Đặt lịch hẹn thăm xưởng
router.post('/', optionalAuthenticate, bookingController.createBooking);

// Authenticated: Lấy danh sách phiếu hẹn (User xem của mình, Editor/Admin xem tất cả)
router.get('/', authenticate, bookingController.getBookings);

// Admin / Editor Management: Cập nhật trạng thái phiếu hẹn
router.patch('/:id/status', authenticate, authorize('editor', 'admin'), bookingController.updateBookingStatus);

module.exports = router;
