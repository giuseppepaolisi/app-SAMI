const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'app-SAMI' },
  transports: [
    // Write all errors to console
    new winston.transports.Console(),
    // Write all errors to error.log
    new winston.transports.File({ filename: 'error.log' })
  ]
});

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.originalUrl,
    method: req.method
  });

  // Determine if this is an API request or a web page request
  const isApiRequest = req.originalUrl.startsWith('/api') || req.xhr;

  if (process.env.NODE_ENV === 'development') {
    if (isApiRequest) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        stack: err.stack,
        error: err
      });
    } else {
      // Render error page with details for development
      return res.status(err.statusCode).render('error', {
        title: 'Error',
        message: err.message,
        stack: err.stack
      });
    }
  }

  // Production error handling - don't leak error details
  if (isApiRequest) {
    // For operational errors, send the error message
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    }
    // For programming or unknown errors, send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  } else {
    // Render appropriate error page
    const statusCode = err.statusCode;
    if (statusCode === 404) {
      return res.status(404).render('404', {
        title: 'Page Not Found'
      });
    }
    return res.status(statusCode).render('error', {
      title: 'Error',
      message: err.isOperational ? err.message : 'Something went wrong'
    });
  }
};

module.exports = {
  errorHandler,
  AppError,
  logger
};