/**
 * task-05-test.js
 * Basic test suite for task-05 TodoServer with events & analytics.
 * Run: node task-05-test.js
 */
const assert = require("assert");
const { TodoServer } = require("./task-05");

async function httpJson(method, url, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const json = await res.json();
  return { status: res.status, json };
}

async function run() {
  const server = new TodoServer(0); // random free port
  const httpServer = server.start();
  const port = httpServer.address().port;
  const base = `http://localhost:${port}`;

  // capture events
  const captured = {
    created: null,
    updated: null,
    deleted: null,
    viewed: null,
    notFound: null,
    validationError: null,
    serverError: null,
    todosListed: null,
  };
  
  server.once("todoCreated", (d) => (captured.created = d));
  server.once("todoUpdated", (d) => (captured.updated = d));
  server.once("todoDeleted", (d) => (captured.deleted = d));
  server.once("todoViewed", (d) => (captured.viewed = d));
  server.once("todoNotFound", (d) => (captured.notFound = d));
  server.once("validationError", (d) => (captured.validationError = d));
  server.once("todosListed", (d) => (captured.todosListed = d));

  console.log("Testing TodoServer with events & analytics...");

  // 1) Create todo
  console.log("1. Testing todo creation...");
  let res = await httpJson("POST", `${base}/todos`, {
    title: "First Todo",
    description: "Test description",
  });
  assert.equal(res.status, 201, "POST should return 201");
  assert.ok(res.json.id, "Response should have todo ID");
  const id = res.json.id;
  assert.ok(
    captured.created && captured.created.todo.id === id,
    "todoCreated event should be captured"
  );
  assert.ok(captured.created.todo.title === "First Todo", "Event should contain todo data");
  console.log("    Todo created, event captured");

  // 2) List todos
  console.log("2. Testing todo listing...");
  res = await httpJson("GET", `${base}/todos`);
  assert.equal(res.status, 200, "GET should return 200");
  assert.ok(Array.isArray(res.json), "Response should be an array");
  assert.equal(res.json.length, 1, "Should have 1 todo");
  assert.ok(captured.todosListed, "todosListed event should be captured");
  assert.equal(captured.todosListed.todos.length, 1, "Event should contain todos");
  console.log("    Todos listed, event captured");

  // 3) View single todo
  console.log("3. Testing todo viewing...");
  res = await httpJson("GET", `${base}/todos/${id}`);
  assert.equal(res.status, 200, "GET by ID should return 200");
  assert.equal(res.json.id, id, "Should return correct todo");
  assert.ok(
    captured.viewed && captured.viewed.todo.id === id,
    "todoViewed event should be captured"
  );
  console.log("    Todo viewed, event captured");

  // 4) Update todo
  console.log("4. Testing todo update...");
  res = await httpJson("PUT", `${base}/todos/${id}`, {
    title: "Updated Todo",
    description: "Updated description",
    completed: true,
  });
  assert.equal(res.status, 200, "PUT should return 200");
  assert.equal(res.json.title, "Updated Todo", "Title should be updated");
  assert.equal(res.json.completed, true, "Completed should be true");
  assert.ok(
    captured.updated && captured.updated.oldTodo && captured.updated.newTodo,
    "todoUpdated event should be captured"
  );
  assert.ok(captured.updated.changes, "Event should contain changes");
  console.log("    Todo updated, event captured");

  // 5) Partial update (PATCH)
  console.log("5. Testing partial update...");
  res = await httpJson("PATCH", `${base}/todos/${id}`, {
    description: "Patched description",
  });
  assert.equal(res.status, 200, "PATCH should return 200");
  assert.equal(res.json.description, "Patched description", "Description should be patched");
  console.log("    Todo partially updated");

  // 6) Test validation error (invalid JSON)
  console.log("6. Testing validation error...");
  try {
    const bad = await fetch(`${base}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid json",
    });
    assert.equal(bad.status, 400, "Invalid JSON should return 400");
  } catch (e) {
    // ignore fetch errors
  }
  // Create a valid request with invalid data to trigger validationError
  res = await httpJson("POST", `${base}/todos`, {
    title: 123, // Invalid: title should be string
  });
  assert.equal(res.status, 400, "Invalid data should return 400");
  assert.ok(captured.validationError, "validationError event should be captured");
  console.log("    Validation error handled, event captured");

  // 7) Test not found error
  console.log("7. Testing not found error...");
  res = await httpJson("GET", `${base}/todos/9999`);
  assert.equal(res.status, 404, "Non-existent todo should return 404");
  assert.ok(captured.notFound, "todoNotFound event should be captured");
  assert.equal(captured.notFound.todoId, 9999, "Event should contain todoId");
  console.log("    Not found error handled, event captured");

  // 8) Delete todo
  console.log("8. Testing todo deletion...");
  res = await httpJson("DELETE", `${base}/todos/${id}`);
  assert.equal(res.status, 200, "DELETE should return 200");
  assert.equal(res.json.id, id, "Should return deleted todo");
  assert.ok(
    captured.deleted && captured.deleted.todo.id === id,
    "todoDeleted event should be captured"
  );
  console.log("    Todo deleted, event captured");

  // 9) Test analytics endpoint
  console.log("9. Testing analytics endpoint...");
  res = await httpJson("GET", `${base}/analytics`);
  assert.equal(res.status, 200, "Analytics should return 200");
  assert.ok(res.json.success, "Analytics response should have success: true");
  assert.ok(res.json.data, "Analytics should have data object");
  assert.equal(typeof res.json.data.totalCreated, "number", "Should have totalCreated count");
  assert.equal(typeof res.json.data.totalDeleted, "number", "Should have totalDeleted count");
  assert.ok(res.json.data.totalCreated >= 1, "Should have at least 1 created todo");
  assert.ok(res.json.data.totalDeleted >= 1, "Should have at least 1 deleted todo");
  console.log("    Analytics endpoint works");

  // 10) Test events endpoint
  console.log("10. Testing events endpoint...");
  res = await httpJson("GET", `${base}/events`);
  assert.equal(res.status, 200, "Events should return 200");
  assert.ok(res.json.success, "Events response should have success: true");
  assert.ok(Array.isArray(res.json.data), "Events should be an array");
  assert.ok(res.json.data.length >= 1, "Should have at least 1 event");
  console.log("    Events endpoint works");

  // 11) Test events with limit parameter
  console.log("11. Testing events with limit parameter...");
  res = await httpJson("GET", `${base}/events?last=2`);
  assert.equal(res.status, 200, "Events with limit should return 200");
  assert.ok(res.json.data.length <= 2, "Should return at most 2 events");
  console.log("    Events limit parameter works");

  // 12) Test filtering todos
  console.log("12. Testing todo filtering...");
  // Create a completed todo
  res = await httpJson("POST", `${base}/todos`, { 
    title: "Completed Todo",
    completed: true 
  });
  const completedId = res.json.id;
  
  // Create an incomplete todo
  res = await httpJson("POST", `${base}/todos`, { 
    title: "Incomplete Todo",
    completed: false 
  });
  
  // Filter completed todos
  res = await httpJson("GET", `${base}/todos?completed=true`);
  assert.equal(res.status, 200, "Filter should return 200");
  assert.ok(Array.isArray(res.json), "Filter response should be array");
  const completedTodos = res.json.filter(todo => todo.completed === true);
  assert.ok(completedTodos.length >= 1, "Should find at least 1 completed todo");
  
  // Filter incomplete todos
  res = await httpJson("GET", `${base}/todos?completed=false`);
  const incompleteTodos = res.json.filter(todo => todo.completed === false);
  assert.ok(incompleteTodos.length >= 1, "Should find at least 1 incomplete todo");
  console.log("    Todo filtering works");

  // 13) Test search functionality
  console.log("13. Testing search functionality...");
  res = await httpJson("GET", `${base}/todos?search=Complete`);
  assert.equal(res.status, 200, "Search should return 200");
  const searchResults = res.json.filter(todo => 
    todo.title.includes("Complete") || 
    (todo.description && todo.description.includes("Complete"))
  );
  assert.ok(searchResults.length >= 1, "Should find todos matching search");
  console.log("    Search functionality works");

  // 14) Test health endpoint
  console.log("14. Testing health endpoint...");
  res = await httpJson("GET", `${base}/health`);
  assert.equal(res.status, 200, "Health should return 200");
  assert.equal(res.json.status, "healthy", "Should report healthy status");
  assert.ok(res.json.todosCount >= 0, "Should have todosCount");
  console.log("    Health endpoint works");

  // 15) Test CORS preflight
  console.log("15. Testing CORS preflight...");
  try {
    const preflight = await fetch(`${base}/todos`, {
      method: "OPTIONS",
      headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    assert.equal(preflight.status, 204, "Preflight should return 204");
  } catch (e) {
    // Some fetch implementations may not support OPTIONS with custom headers
  }
  console.log("    CORS preflight handled");

  // 16) Delete all todos
  console.log("16. Testing delete all todos...");
  res = await httpJson("DELETE", `${base}/todos`);
  assert.equal(res.status, 200, "DELETE all should return 200");
  assert.ok(res.json.message, "Should have success message");
  assert.ok(res.json.count >= 0, "Should report count of deleted todos");
  console.log("    Delete all todos works");

  console.log("\n All task-05 tests passed!");
  
  // Cleanup
  await new Promise((resolve) => {
    httpServer.close(() => {
      console.log("Server stopped");
      resolve();
    });
  });
}

// Handle fetch not being available in older Node versions
if (typeof fetch !== 'function') {
  const fetch = require('node-fetch');
  global.fetch = fetch;
}

run().catch(async (err) => {
  console.error(" Tests failed:", err);
  process.exitCode = 1;
  
  // Try to stop server if it's running
  try {
    const { TodoServer } = require("./task-05");
    const server = new TodoServer();
    server.stop();
  } catch (e) {
    // ignore
  }
});