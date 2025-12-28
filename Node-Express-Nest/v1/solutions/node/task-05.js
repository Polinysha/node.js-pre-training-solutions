const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");

// ---------- Utilities ----------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

// ---------- Logger ----------

class ConsoleLogger {
  constructor(server) {
    this.server = server;
  }

  logEvent(eventType, data) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] EVENT: ${eventType}`);
    if (data) {
      console.log("  Data:", JSON.stringify(data, null, 2));
    }
  }
}

// ---------- Analytics Tracker ----------

class AnalyticsTracker {
  constructor() {
    this.counters = {
      created: 0,
      updated: 0,
      deleted: 0,
      viewed: 0,
      listed: 0,
      notFound: 0,
      validationErrors: 0,
      serverErrors: 0,
    };

    this.dailyStats = {};
    this.eventsHistory = [];
    this.maxEvents = 100;
  }

  increment(counter) {
    if (this.counters[counter] !== undefined) {
      this.counters[counter]++;
    }
  }

  addEvent(event) {
    this.eventsHistory.unshift({
      eventType: event.type,
      timestamp: event.timestamp,
      data: event.data,
    });

    if (this.eventsHistory.length > this.maxEvents) {
      this.eventsHistory.pop();
    }
  }

  updateDailyStats(date, operation) {
    const dateStr = date.split("T")[0];
    if (!this.dailyStats[dateStr]) {
      this.dailyStats[dateStr] = {
        created: 0,
        updated: 0,
        deleted: 0,
        viewed: 0,
        listed: 0,
      };
    }

    if (this.dailyStats[dateStr][operation] !== undefined) {
      this.dailyStats[dateStr][operation]++;
    }
  }

  getAnalytics() {
    return {
      totalCreated: this.counters.created,
      totalUpdated: this.counters.updated,
      totalDeleted: this.counters.deleted,
      totalViews: this.counters.viewed,
      totalListings: this.counters.listed,
      errors: this.counters.notFound + this.counters.validationErrors + this.counters.serverErrors,
      dailyStats: this.dailyStats,
    };
  }

  getRecentEvents(limit = 10) {
    return this.eventsHistory.slice(0, Math.min(limit, this.eventsHistory.length));
  }
}

// ---------- TodoServer ----------

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.server = null;
    this.todos = [];
    this.currentId = 1;

    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger(this);

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.on("todoCreated", (data) => {
      this.analytics.increment("created");
      this.analytics.updateDailyStats(data.timestamp, "created");
      this.analytics.addEvent({
        type: "todoCreated",
        timestamp: data.timestamp,
        data: { todo: data.todo },
      });
      this.logger.logEvent("todoCreated", data);
    });

    this.on("todoUpdated", (data) => {
      this.analytics.increment("updated");
      this.analytics.updateDailyStats(data.timestamp, "updated");
      this.analytics.addEvent({
        type: "todoUpdated",
        timestamp: data.timestamp,
        data: { oldTodo: data.oldTodo, newTodo: data.newTodo, changes: data.changes },
      });
      this.logger.logEvent("todoUpdated", data);
    });

    this.on("todoDeleted", (data) => {
      this.analytics.increment("deleted");
      this.analytics.updateDailyStats(data.timestamp, "deleted");
      this.analytics.addEvent({
        type: "todoDeleted",
        timestamp: data.timestamp,
        data: { todo: data.todo },
      });
      this.logger.logEvent("todoDeleted", data);
    });

    this.on("todoViewed", (data) => {
      this.analytics.increment("viewed");
      this.analytics.updateDailyStats(data.timestamp, "viewed");
      this.analytics.addEvent({
        type: "todoViewed",
        timestamp: data.timestamp,
        data: { todo: data.todo },
      });
      this.logger.logEvent("todoViewed", data);
    });

    this.on("todosListed", (data) => {
      this.analytics.increment("listed");
      this.analytics.updateDailyStats(data.timestamp, "listed");
      this.analytics.addEvent({
        type: "todosListed",
        timestamp: data.timestamp,
        data: { count: data.todos.length, filters: data.filters },
      });
      this.logger.logEvent("todosListed", data);
    });

    this.on("todoNotFound", (data) => {
      this.analytics.increment("notFound");
      this.analytics.addEvent({
        type: "todoNotFound",
        timestamp: data.timestamp,
        data: { todoId: data.todoId, operation: data.operation },
      });
      this.logger.logEvent("todoNotFound", data);
    });

    this.on("validationError", (data) => {
      this.analytics.increment("validationErrors");
      this.analytics.addEvent({
        type: "validationError",
        timestamp: data.timestamp,
        data: { errors: data.errors, requestInfo: data.requestInfo },
      });
      this.logger.logEvent("validationError", data);
    });

    this.on("serverError", (data) => {
      this.analytics.increment("serverErrors");
      this.analytics.addEvent({
        type: "serverError",
        timestamp: data.timestamp,
        data: { error: data.error.message, operation: data.operation },
      });
      this.logger.logEvent("serverError", data);
    });
  }

  getRequestInfo(req) {
    const parsedUrl = url.parse(req.url, true);
    return {
      method: req.method,
      url: req.url,
      path: parsedUrl.pathname,
      query: parsedUrl.query,
      headers: req.headers,
      timestamp: new Date().toISOString(),
    };
  }

  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const requestInfo = this.getRequestInfo(req);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      });
      res.end();
      return;
    }

    try {
      if (pathname === "/todos" || pathname === "/todos/") {
        await this.handleTodos(req, res, parsedUrl, requestInfo);
      } else if (pathname.startsWith("/todos/")) {
        await this.handleTodoById(req, res, parsedUrl, requestInfo);
      } else if (pathname === "/analytics" || pathname === "/analytics/") {
        this.handleAnalytics(req, res, parsedUrl);
      } else if (pathname === "/events" || pathname === "/events/") {
        this.handleEvents(req, res, parsedUrl);
      } else if (pathname === "/health" || pathname === "/health/") {
        this.handleHealth(req, res);
      } else {
        sendJson(res, 404, { error: "Not Found" });
      }
    } catch (error) {
      console.error("Server error:", error);
      this.emit("serverError", {
        error,
        operation: req.method + " " + req.url,
        requestInfo,
        timestamp: new Date().toISOString(),
      });
      sendJson(res, 500, { error: "Internal Server Error" });
    }
  }

  async handleTodos(req, res, parsedUrl, requestInfo) {
    const query = parsedUrl.query;

    switch (req.method) {
      case "GET":
        let todos = this.todos;

        if (query.completed) {
          const completed = query.completed === "true";
          todos = todos.filter((todo) => todo.completed === completed);
        }

        if (query.search) {
          const searchTerm = query.search.toLowerCase();
          todos = todos.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              (todo.description && todo.description.toLowerCase().includes(searchTerm))
          );
        }

        sendJson(res, 200, todos);

        this.emit("todosListed", {
          todos,
          count: todos.length,
          filters: query,
          requestInfo,
          timestamp: new Date().toISOString(),
        });
        break;

      case "POST":
        try {
          const body = await parseBody(req);

          if (!body.title || typeof body.title !== "string") {
            this.emit("validationError", {
              errors: ["Title is required and must be a string"],
              data: body,
              requestInfo,
              timestamp: new Date().toISOString(),
            });
            sendJson(res, 400, { error: "Title is required and must be a string" });
            return;
          }

          const todo = {
            id: this.currentId++,
            title: body.title,
            description: body.description || "",
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          this.todos.push(todo);
          sendJson(res, 201, todo);

          this.emit("todoCreated", {
            todo,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          this.emit("validationError", {
            errors: [error.message],
            data: null,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
          sendJson(res, 400, { error: "Invalid JSON" });
        }
        break;

      case "DELETE":
        const deletedTodos = this.todos;
        this.todos = [];
        this.currentId = 1;
        sendJson(res, 200, {
          message: "All todos deleted",
          count: deletedTodos.length,
        });

        deletedTodos.forEach((todo) => {
          this.emit("todoDeleted", {
            todo,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
        });
        break;

      default:
        sendJson(res, 405, { error: "Method Not Allowed" });
    }
  }

  async handleTodoById(req, res, parsedUrl, requestInfo) {
    const id = parseIdFromPath(parsedUrl.pathname);
    if (!id) {
      sendJson(res, 400, { error: "Invalid todo ID" });
      return;
    }

    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      this.emit("todoNotFound", {
        todoId: id,
        operation: req.method,
        requestInfo,
        timestamp: new Date().toISOString(),
      });
      sendJson(res, 404, { error: "Todo not found" });
      return;
    }

    switch (req.method) {
      case "GET":
        const todo = this.todos[todoIndex];
        sendJson(res, 200, todo);

        this.emit("todoViewed", {
          todo,
          requestInfo,
          timestamp: new Date().toISOString(),
        });
        break;

      case "PUT":
        try {
          const body = await parseBody(req);

          if (!body.title || typeof body.title !== "string") {
            this.emit("validationError", {
              errors: ["Title is required and must be a string"],
              data: body,
              requestInfo,
              timestamp: new Date().toISOString(),
            });
            sendJson(res, 400, { error: "Title is required and must be a string" });
            return;
          }

          if (typeof body.completed !== "boolean") {
            this.emit("validationError", {
              errors: ["Completed must be a boolean"],
              data: body,
              requestInfo,
              timestamp: new Date().toISOString(),
            });
            sendJson(res, 400, { error: "Completed must be a boolean" });
            return;
          }

          const oldTodo = { ...this.todos[todoIndex] };
          const changes = {};

          Object.keys(body).forEach((key) => {
            if (oldTodo[key] !== body[key]) {
              changes[key] = { from: oldTodo[key], to: body[key] };
            }
          });

          this.todos[todoIndex] = {
            ...oldTodo,
            ...body,
            id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString(),
          };

          const newTodo = this.todos[todoIndex];
          sendJson(res, 200, newTodo);

          this.emit("todoUpdated", {
            oldTodo,
            newTodo,
            changes,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          this.emit("validationError", {
            errors: [error.message],
            data: null,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
          sendJson(res, 400, { error: "Invalid JSON" });
        }
        break;

      case "PATCH":
        try {
          const body = await parseBody(req);

          if (body.title !== undefined && typeof body.title !== "string") {
            this.emit("validationError", {
              errors: ["Title must be a string"],
              data: body,
              requestInfo,
              timestamp: new Date().toISOString(),
            });
            sendJson(res, 400, { error: "Title must be a string" });
            return;
          }

          if (body.completed !== undefined && typeof body.completed !== "boolean") {
            this.emit("validationError", {
              errors: ["Completed must be a boolean"],
              data: body,
              requestInfo,
              timestamp: new Date().toISOString(),
            });
            sendJson(res, 400, { error: "Completed must be a boolean" });
            return;
          }

          const oldTodo = { ...this.todos[todoIndex] };
          const changes = {};

          Object.keys(body).forEach((key) => {
            if (oldTodo[key] !== body[key]) {
              changes[key] = { from: oldTodo[key], to: body[key] };
            }
          });

          this.todos[todoIndex] = {
            ...oldTodo,
            ...body,
            updatedAt: new Date().toISOString(),
          };

          const newTodo = this.todos[todoIndex];
          sendJson(res, 200, newTodo);

          this.emit("todoUpdated", {
            oldTodo,
            newTodo,
            changes,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          this.emit("validationError", {
            errors: [error.message],
            data: null,
            requestInfo,
            timestamp: new Date().toISOString(),
          });
          sendJson(res, 400, { error: "Invalid JSON" });
        }
        break;

      case "DELETE":
        const deletedTodo = this.todos.splice(todoIndex, 1)[0];
        sendJson(res, 200, deletedTodo);

        this.emit("todoDeleted", {
          todo: deletedTodo,
          requestInfo,
          timestamp: new Date().toISOString(),
        });
        break;

      default:
        sendJson(res, 405, { error: "Method Not Allowed" });
    }
  }

  handleAnalytics(req, res, parsedUrl) {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "Method Not Allowed" });
      return;
    }

    const analytics = this.analytics.getAnalytics();
    sendJson(res, 200, {
      success: true,
      data: analytics,
    });
  }

  handleEvents(req, res, parsedUrl) {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "Method Not Allowed" });
      return;
    }

    const query = parsedUrl.query;
    const limit = query.last ? parseInt(query.last) : 10;
    const events = this.analytics.getRecentEvents(limit);

    sendJson(res, 200, {
      success: true,
      data: events,
    });
  }

  handleHealth(req, res) {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "Method Not Allowed" });
      return;
    }

    sendJson(res, 200, {
      status: "healthy",
      timestamp: new Date().toISOString(),
      todosCount: this.todos.length,
      memoryUsage: process.memoryUsage(),
    });
  }

  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(this.port, () => {
      console.log(`TodoServer with Events started on http://localhost:${this.port}`);
      console.log("Available endpoints:");
      console.log("  GET    /todos          - Get all todos");
      console.log("  POST   /todos          - Create new todo");
      console.log("  DELETE /todos          - Delete all todos");
      console.log("  GET    /todos/:id      - Get todo by ID");
      console.log("  PUT    /todos/:id      - Update todo by ID");
      console.log("  PATCH  /todos/:id      - Partially update todo by ID");
      console.log("  DELETE /todos/:id      - Delete todo by ID");
      console.log("  GET    /analytics      - Get analytics");
      console.log("  GET    /events         - Get recent events");
      console.log("  GET    /health         - Health check");
    });

    this.server.on("error", (error) => {
      console.error("Server error:", error);
    });

    return this.server;
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log("TodoServer stopped");
      });
    }
  }
}

module.exports = { TodoServer };