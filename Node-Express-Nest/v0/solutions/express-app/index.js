const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

let todos = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Learn Express.js", completed: true },
  { id: 3, title: "Walk the dog", completed: false },
];
let nextId = 4;

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Express Todo API",
    endpoints: {
      getAllTodos: "GET /todos",
      createTodo: "POST /todos",
      getTodoById: "GET /todos/:id",
      searchTodos: "GET /todos/search",
      staticFiles: "GET /static",
    },
  });
});
app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required and must be a non-empty string",
    });
  }

  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get("/todos/search", (req, res) => {
  const { completed } = req.query;
  
  console.log("=== SEARCH ENDPOINT CALLED ===");
  console.log("Query params:", req.query);
  
  if (completed === undefined || completed === null || completed === "") {
    return res.json(todos);
  }
  
  const completedStr = String(completed).toLowerCase();
  
  if (completedStr === "true") {
    const result = todos.filter(todo => todo.completed === true);
    return res.json(result);
  }
  
  if (completedStr === "false") {
    const result = todos.filter(todo => todo.completed === false);
    return res.json(result);
  }
  
  return res.status(400).json({
    error: "Completed must be 'true' or 'false'",
    received: completed
  });
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

const publicDir = path.join(__dirname, "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const indexHtmlPath = path.join(publicDir, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Todo App - Static Files</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Static Files Demo</h1>
    <p>This is a static HTML file served by Express.</p>
    <p>Endpoint: GET /static/index.html</p>
</body>
</html>
  `;
  fs.writeFileSync(indexHtmlPath, htmlContent.trim());
}

app.use("/static", express.static(publicDir));

app.get("/test-error", (req, res, next) => {
  const error = new Error("Test error for Task 7");
  error.status = 500;
  next(error);
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: errorMessage,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  GET  http://localhost:${PORT}/todos`);
    console.log(`  POST http://localhost:${PORT}/todos`);
    console.log(`  GET  http://localhost:${PORT}/todos/:id`);
    console.log(`  GET  http://localhost:${PORT}/todos/search?completed=true`);
    console.log(`  GET  http://localhost:${PORT}/static/index.html`);
    console.log(`  GET  http://localhost:${PORT}/test-error (test error)`);
  });
}
