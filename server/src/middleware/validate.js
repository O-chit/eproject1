const { error } = require('../utils/response');

/**
 * Middleware kiểm tra tính hợp lệ dữ liệu đầu vào (Validation Middleware)
 * Hỗ trợ Zod schema hoặc validator function tùy biến
 * 
 * @param {object} schema - Schema validator (Zod schema hoặc function kiểm tra)
 * @param {'body'|'query'|'params'} [source='body'] - Nguồn dữ liệu cần kiểm tra
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      if (!schema) return next();

      // Trường hợp schema là Zod schema (có phương thức safeParse hoặc parseAsync)
      if (typeof schema.safeParseAsync === 'function') {
        const result = await schema.safeParseAsync(req[source]);
        if (!result.success) {
          const details = result.error.errors.map((err) => ({
            field: err.path.join('.'),
            issue: err.message,
          }));
          return error(res, 400, 'VALIDATION_ERROR', 'Dữ liệu đầu vào không hợp lệ', details);
        }
        req[source] = result.data;
        return next();
      }

      if (typeof schema.safeParse === 'function') {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
          const details = result.error.errors.map((err) => ({
            field: err.path.join('.'),
            issue: err.message,
          }));
          return error(res, 400, 'VALIDATION_ERROR', 'Dữ liệu đầu vào không hợp lệ', details);
        }
        req[source] = result.data;
        return next();
      }

      // Trường hợp schema là function validator tùy biến: (data) => { isValid, details }
      if (typeof schema === 'function') {
        const validation = await schema(req[source]);
        if (validation && validation.isValid === false) {
          return error(
            res,
            400,
            'VALIDATION_ERROR',
            validation.message || 'Dữ liệu đầu vào không hợp lệ',
            validation.details || []
          );
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  validate,
};
