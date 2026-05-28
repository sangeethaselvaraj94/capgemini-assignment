const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const response = {
    status: err.status || (statusCode >= 500 ? 'error' : 'fail'),
    message: err.message || 'Internal Server Error',
    ...(err.details ? { details: err.details } : {}),
  };

  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  logger.error('%s %s %s', req.method, req.originalUrl, err.stack || err.message);
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
