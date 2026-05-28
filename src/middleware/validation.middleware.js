const { validationResult } = require('express-validator');
const AppError = require('../utils/app-error');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extracted = errors.array().map((err) => ({ field: err.param, message: err.msg }));
  return next(new AppError('Validation failed', 422, { errors: extracted }));
};

module.exports = validateRequest;
