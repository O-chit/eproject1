/**
 * Wrapper for async route handlers to automatically catch errors and pass to next()
 * @param {Function} fn
 * @returns {import('express').RequestHandler}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
