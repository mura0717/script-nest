import { handleError } from '../utils/errorHandling/errorHandlers.js';

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  handleError(err, res);
};

export default errorMiddleware;
