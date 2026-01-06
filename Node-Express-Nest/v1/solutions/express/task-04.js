const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = 3003;

class TodoService {
    constructor() {
        this.todos = [];
        this.currentId = 1;
    }

    getAllTodos() {
        return this.todos;
    }

    getTodoById(id) {
        return this.todos.find(todo => todo.id === id);
    }

    createTodo(todoData) {
        const todo = {
            id: this.currentId++,
            title: todoData.title,
            description: todoData.description || '',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        return todo;
    }

    updateTodo(id, updateData) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        
        if (todoIndex === -1) return null;
        
        this.todos[todoIndex] = {
            ...this.todos[todoIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        return this.todos[todoIndex];
    }

    deleteTodo(id) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        
        if (todoIndex === -1) return null;
        
        return this.todos.splice(todoIndex, 1)[0];
    }

    searchTodos(searchTerm) {
        if (!searchTerm) return this.todos;
        
        const term = searchTerm.toLowerCase();
        return this.todos.filter(todo => 
            todo.title.toLowerCase().includes(term) ||
            todo.description.toLowerCase().includes(term)
        );
    }

    getStats() {
        return {
            total: this.todos.length,
            completed: this.todos.filter(todo => todo.completed).length,
            pending: this.todos.filter(todo => !todo.completed).length
        };
    }
}

const todoService = new TodoService();

todoService.createTodo({ title: 'Learn Express.js', description: 'Study middleware and routing' });
todoService.createTodo({ title: 'Build REST API', description: 'Create ToDo API endpoints' });
todoService.createTodo({ title: 'Implement validation', description: 'Add request validation middleware' });

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                value: err.value,
                message: err.msg
            }))
        });
    }
    next();
};

const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

const createTodoValidation = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean')
        .toBoolean()
];

const updateTodoValidation = [
    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean')
        .toBoolean()
];

app.use(express.json());
app.use(requestLogger);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

app.get('/todos', (req, res) => {
    const { search, completed } = req.query;
    
    let todos = todoService.getAllTodos();
    
    if (search) {
        todos = todoService.searchTodos(search);
    }
    
    if (completed !== undefined) {
        const completedBool = completed === 'true';
        todos = todos.filter(todo => todo.completed === completedBool);
    }
    
    res.json({
        success: true,
        data: todos,
        count: todos.length,
        timestamp: new Date().toISOString()
    });
});

app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid todo ID'
        });
    }
    
    const todo = todoService.getTodoById(id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            error: `Todo with ID ${id} not found`
        });
    }
    
    res.json({
        success: true,
        data: todo,
        timestamp: new Date().toISOString()
    });
});

app.post('/todos', createTodoValidation, validateRequest, (req, res) => {
    const todo = todoService.createTodo(req.body);
    
    res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: todo,
        timestamp: new Date().toISOString()
    });
});

app.put('/todos/:id', updateTodoValidation, validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid todo ID'
        });
    }
    
    const updatedTodo = todoService.updateTodo(id, req.body);
    
    if (!updatedTodo) {
        return res.status(404).json({
            success: false,
            error: `Todo with ID ${id} not found`
        });
    }
    
    res.json({
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo,
        timestamp: new Date().toISOString()
    });
});

app.patch('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid todo ID'
        });
    }
    
    const todo = todoService.getTodoById(id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            error: `Todo with ID ${id} not found`
        });
    }
    
    const updateData = req.body.completed !== undefined 
        ? req.body 
        : { completed: !todo.completed };
    
    const updatedTodo = todoService.updateTodo(id, updateData);
    
    res.json({
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo,
        timestamp: new Date().toISOString()
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid todo ID'
        });
    }
    
    const deletedTodo = todoService.deleteTodo(id);
    
    if (!deletedTodo) {
        return res.status(404).json({
            success: false,
            error: `Todo with ID ${id} not found`
        });
    }
    
    res.json({
        success: true,
        message: 'Todo deleted successfully',
        data: deletedTodo,
        timestamp: new Date().toISOString()
    });
});

app.delete('/todos', (req, res) => {

    const oldTodos = [...todoService.todos];
    todoService.todos = [];
    todoService.currentId = 1;
    
    res.json({
        success: true,
        message: 'All todos deleted successfully',
        deletedCount: oldTodos.length,
        timestamp: new Date().toISOString()
    });
});

app.get('/todos/stats', (req, res) => {
    const stats = todoService.getStats();
    
    res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        todosCount: todoService.todos.length,
        uptime: process.uptime()
    });
});

app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    
    res.status(500).json({
        success: false,
        error: {
            message: 'Internal server error',
            timestamp: new Date().toISOString()
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.url} not found`,
            timestamp: new Date().toISOString()
        }
    });
});

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('ToDo REST API Server');
    console.log('='.repeat(50));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nAvailable Endpoints:');
    console.log('  GET    /todos           - Get all todos (with ?search=term&completed=true)');
    console.log('  GET    /todos/:id       - Get todo by ID');
    console.log('  POST   /todos           - Create new todo');
    console.log('  PUT    /todos/:id       - Update todo');
    console.log('  PATCH  /todos/:id       - Toggle completion');
    console.log('  DELETE /todos/:id       - Delete todo');
    console.log('  DELETE /todos           - Delete all todos');
    console.log('  GET    /todos/stats     - Get todo statistics');
    console.log('  GET    /health          - Health check');
    console.log('\nSample Requests:');
    console.log('  curl http://localhost:3003/todos');
    console.log('  curl http://localhost:3003/todos?search=express');
    console.log('  curl -X POST http://localhost:3003/todos \\');
    console.log('       -H "Content-Type: application/json" \\');
    console.log('       -d \'{"title":"New Todo","description":"Learn validation"}\'');
    console.log('  curl -X PUT http://localhost:3003/todos/1 \\');
    console.log('       -H "Content-Type: application/json" \\');
    console.log('       -d \'{"title":"Updated Title","completed":true}\'');
    console.log('='.repeat(50));
});
