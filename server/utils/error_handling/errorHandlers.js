export const handleError = (err, res) => {
    const { statusCode, message } = err;
  
    res.status(statusCode).json({
      status: err.status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };

  // async wrapper
  export const catchAsync = (asyncFunc) => {
    return (req, res, next) => {
      asyncFunc(req, res, next).catch(next);
    };
  };
  
  