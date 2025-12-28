const http = require("http");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  const params = {};
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  if (patternParts.length !== pathParts.length) {
    return params;
  }

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].substring(1);
      params[paramName] = pathParts[i];
    }
  }

  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  const responseData = {
    success: statusCode >= 200 && statusCode < 300,
    ...data
  };

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(JSON.stringify(responseData));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  const errors = [];

  // Title validation
  if (!isUpdate || todoData.title !== undefined) {
    if (todoData.title === undefined && !isUpdate) {
      errors.push("Title is required");
    } else if (todoData.title !== undefined) {
      if (typeof todoData.title !== "string") {
        errors.push("Title must be a string");
      } else {
        const trimmedTitle = todoData.title.trim();
        if (trimmedTitle.length === 0) {
          errors.push("Title cannot be empty or only whitespace");
        } else if (trimmedTitle.length > 100) {
          errors.push("Title must be 100 characters or less");
        }
      }
    }
  }

  // Description validation
  if (todoData.description !== undefined) {
    if (typeof todoData.description !== "string") {
      errors.push("Description must be a string");
    } else if (todoData.description.length > 500) {
      errors.push("Description must be 500 characters or less");
    }
  }

  // Completed validation
  if (todoData.completed !== undefined && typeof todoData.completed !== "boolean") {
    errors.push("Completed must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    this.port = port;
    this.todos = [];
    this.nextId = 1;
    this.server = null;

    this.initializeSampleData();
  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    const now = new Date().toISOString();
    
    this.todos = [
      {
        id: this.nextId++,
        title: "Learn Node.js",
        description: "Complete Task 04 - HTTP Server",
        completed: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.nextId++,
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        completed: true,
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  /**
   * Start the HTTP server
   */
  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(this.port, () => {
      console.log(`TodoServer running on http://localhost:${this.port}`);
      console.log("Available endpoints:");
      console.log("  GET    /todos          - Get all todos");
      console.log("  POST   /todos          - Create new todo");
      console.log("  GET    /todos/:id      - Get todo by ID");
      console.log("  PUT    /todos/:id      - Update todo by ID");
      console.log("  DELETE /todos/:id      - Delete todo by ID");
      console.log("  GET    /todos?completed=true - Filter todos");
    });

    this.server.on("error", (error) => {
      console.error("Server error:", error);
    });
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    try {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      const method = req.method;

      // Handle CORS preflight
      if (method === "OPTIONS") {
        this.handleCORS(req, res);
        return;
      }

      // Route to appropriate handler
      if (pathname === "/todos" || pathname === "/todos/") {
        await this.getAllTodos(req, res, parsedUrl.query);
      } else if (pathname.startsWith("/todos/")) {
        const params = parsePathParams("/todos/:id", pathname);
        
        if (!params.id) {
          sendResponse(res, 400, { error: "Invalid ID format" });
          return;
        }

        switch (method) {
          case "GET":
            await this.getTodoById(req, res, params);
            break;
          case "PUT":
            await this.updateTodo(req, res, params);
            break;
          case "DELETE":
            await this.deleteTodo(req, res, params);
            break;
          default:
            sendResponse(res, 405, { error: "Method not allowed" });
        }
      } else if (method === "POST" && (pathname === "/todos" || pathname === "/todos/")) {
        await this.createTodo(req, res);
      } else {
        sendResponse(res, 404, { error: "Not found" });
      }
    } catch (error) {
      console.error("Request handling error:", error);
      
      if (error.message === "Invalid JSON") {
        sendResponse(res, 400, { error: "Invalid JSON" });
      } else {
        sendResponse(res, 500, { error: "Internal server error" });
      }
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    let filteredTodos = [...this.todos];

    // Apply completed filter if provided
    if (query.completed !== undefined) {
      const completed = query.completed === "true";
      filteredTodos = filteredTodos.filter(todo => todo.completed === completed);
    }

    // Apply search filter if provided
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm))
      );
    }

    sendResponse(res, 200, {
      data: filteredTodos,
      count: filteredTodos.length
    });
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    const todoId = parseInt(params.id, 10);
    
    if (isNaN(todoId)) {
      sendResponse(res, 400, { error: "Invalid ID format" });
      return;
    }

    const todo = this.findTodoById(todoId);
    
    if (!todo) {
      sendResponse(res, 404, { error: "Todo not found" });
      return;
    }

    sendResponse(res, 200, { data: todo });
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    try {
      const todoData = await parseBody(req);
      
      // Validate todo data
      const validation = validateTodo(todoData, false);
      if (!validation.isValid) {
        sendResponse(res, 400, { error: validation.errors.join(", ") });
        return;
      }

      // Create new todo
      const now = new Date().toISOString();
      const newTodo = {
        id: this.generateNextId(),
        title: todoData.title.trim(),
        description: todoData.description ? todoData.description.trim() : "",
        completed: todoData.completed || false,
        createdAt: now,
        updatedAt: now
      };

      this.todos.push(newTodo);
      sendResponse(res, 201, { data: newTodo });
    } catch (error) {
      if (error.message === "Invalid JSON") {
        sendResponse(res, 400, { error: "Invalid JSON" });
      } else {
        sendResponse(res, 500, { error: "Internal server error" });
      }
    }
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    try {
      const todoId = parseInt(params.id, 10);
      
      if (isNaN(todoId)) {
        sendResponse(res, 400, { error: "Invalid ID format" });
        return;
      }

      const todoIndex = this.findTodoIndexById(todoId);
      
      if (todoIndex === -1) {
        sendResponse(res, 404, { error: "Todo not found" });
        return;
      }

      const updateData = await parseBody(req);
      
      // Validate update data
      const validation = validateTodo(updateData, true);
      if (!validation.isValid) {
        sendResponse(res, 400, { error: validation.errors.join(", ") });
        return;
      }

      // Update todo
      const updatedTodo = {
        ...this.todos[todoIndex],
        ...updateData
      };

      // Preserve important fields
      updatedTodo.id = todoId;
      updatedTodo.updatedAt = new Date().toISOString();
      
      // Clean up title and description if provided
      if (updateData.title !== undefined) {
        updatedTodo.title = updateData.title.trim();
      }
      if (updateData.description !== undefined) {
        updatedTodo.description = updateData.description.trim();
      }

      this.todos[todoIndex] = updatedTodo;
      sendResponse(res, 200, { data: updatedTodo });
    } catch (error) {
      if (error.message === "Invalid JSON") {
        sendResponse(res, 400, { error: "Invalid JSON" });
      } else {
        sendResponse(res, 500, { error: "Internal server error" });
      }
    }
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    const todoId = parseInt(params.id, 10);
    
    if (isNaN(todoId)) {
      sendResponse(res, 400, { error: "Invalid ID format" });
      return;
    }

    const todoIndex = this.findTodoIndexById(todoId);
    
    if (todoIndex === -1) {
      sendResponse(res, 404, { error: "Todo not found" });
      return;
    }

    const deletedTodo = this.todos.splice(todoIndex, 1)[0];
    sendResponse(res, 200, { 
      message: "Todo deleted successfully",
      data: deletedTodo
    });
  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    });
    res.end();
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;
    
    return this.todos.find(todo => todo.id === numId) || null;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return -1;
    
    return this.todos.findIndex(todo => todo.id === numId);
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    return this.nextId++;
  }

  /**
   * Stop the HTTP server
   */
  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log("TodoServer stopped");
      });
    }
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}