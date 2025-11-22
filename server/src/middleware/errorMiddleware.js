import { env } from '../config/env.js';

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    message: err.message || 'Internal server error'
  };

  if (env.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  console.error('Error:', err);

  res.status(statusCode).json(response);
};
