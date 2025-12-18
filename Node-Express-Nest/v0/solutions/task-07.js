// Express.js error handler middleware for ToDo API
function errorHandlerMiddleware(err, req, res, next) {
  // ТОЧНО как в задании: returns { error: <message> }
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandlerMiddleware;
