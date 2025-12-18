// Express.js logging middleware for ToDo API
function loggingMiddleware(req, res, next) {
  // ТОЧНО как в примере задания: logs "GET /todos"
  console.log(`${req.method} ${req.url}`);
  next();
}

module.exports = loggingMiddleware;
