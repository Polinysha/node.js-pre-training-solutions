const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                param: err.param,
                value: err.value,
                message: err.msg
            }))
        });
    }
    next();
};

const users = [
    { id: 1, name: 'Alice', active: true, email: 'alice@example.com' },
    { id: 2, name: 'Bob', active: false, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', active: true, email: 'charlie@example.com' },
    { id: 4, name: 'Diana', active: true, email: 'diana@example.com' },
    { id: 5, name: 'Eve', active: false, email: 'eve@example.com' }
];

app.get(
    '/users/:id',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID must be a positive integer')
            .toInt(),
        
        query('active')
            .optional()
            .isIn(['true', 'false'])
            .withMessage('Active must be either "true" or "false"')
            .toBoolean(),
        
        query('fields')
            .optional()
            .isString()
            .withMessage('Fields must be a string')
            .custom(value => {
                const allowedFields = ['name', 'email', 'active'];
                const requestedFields = value.split(',');
                return requestedFields.every(field => allowedFields.includes(field.trim()));
            })
            .withMessage('Fields can only include: name, email, active'),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt(),
        
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer')
            .toInt()
    ],
    validateRequest,
    (req, res) => {
        const userId = req.params.id;
        const active = req.query.active;
        const fields = req.query.fields;
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        
        console.log(`[Request] GET /users/${userId}`);
        console.log(`  Params: id=${userId}`);
        console.log(`  Query: active=${active}, fields=${fields}, limit=${limit}, page=${page}`);
        
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${userId} not found`
            });
        }
        
        if (active !== undefined && user.active !== active) {
            return res.status(404).json({
                success: false,
                message: `User ${userId} is ${user.active ? 'active' : 'inactive'}, but requested ${active ? 'active' : 'inactive'} users only`
            });
        }
        
        let responseUser = { ...user };
        if (fields) {
            const requestedFields = fields.split(',').map(f => f.trim());
            responseUser = {};
            requestedFields.forEach(field => {
                if (user[field] !== undefined) {
                    responseUser[field] = user[field];
                }
            });
        }
        
        const statusMessage = user.active ? 'is active' : 'is inactive';
        const message = `User ${userId} ${statusMessage}`;
        
        res.json({
            success: true,
            message: message,
            data: responseUser,
            request: {
                id: userId,
                active: active,
                fields: fields,
                limit: limit,
                page: page
            }
        });
    }
);

app.get(
    '/users',
    [
        query('active')
            .optional()
            .isIn(['true', 'false'])
            .withMessage('Active must be either "true" or "false"')
            .toBoolean(),
        
        query('search')
            .optional()
            .isString()
            .withMessage('Search must be a string')
            .trim()
            .escape(),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt(),
        
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer')
            .toInt(),
        
        query('sort')
            .optional()
            .isIn(['id', 'name', 'active'])
            .withMessage('Sort can only be: id, name, active')
    ],
    validateRequest,
    (req, res) => {
        const { active, search, limit = 10, page = 1, sort = 'id' } = req.query;
        
        console.log(`[Request] GET /users`);
        console.log(`  Query: active=${active}, search=${search}, limit=${limit}, page=${page}, sort=${sort}`);
        
        let filteredUsers = [...users];
        
        if (active !== undefined) {
            filteredUsers = filteredUsers.filter(user => user.active === active);
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        }
        
        filteredUsers.sort((a, b) => {
            if (sort === 'name') return a.name.localeCompare(b.name);
            if (sort === 'active') return (a.active === b.active) ? 0 : a.active ? -1 : 1;
            return a.id - b.id; 
        });
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        const totalPages = Math.ceil(filteredUsers.length / limit);
        
        res.json({
            success: true,
            message: `Found ${filteredUsers.length} user(s)`,
            data: paginatedUsers,
            pagination: {
                total: filteredUsers.length,
                page: page,
                limit: limit,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            filters: {
                active: active,
                search: search,
                sort: sort
            }
        });
    }
);

app.post(
    '/users',
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isString()
            .withMessage('Name must be a string')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .escape(),
        
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        
        body('active')
            .optional()
            .isBoolean()
            .withMessage('Active must be a boolean')
            .toBoolean()
    ],
    validateRequest,
    (req, res) => {
        const { name, email, active = true } = req.body;
        
        console.log(`[Request] POST /users`);
        console.log(`  Body: name=${name}, email=${email}, active=${active}`);
        
        if (users.some(user => user.email === email)) {
            return res.status(400).json({
                success: false,
                message: `User with email ${email} already exists`
            });
        }
        
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            active: active,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    }
);

app.use((err, req, res, next) => {
    console.error('[Error]', err.message);
    
    res.status(err.status || 500).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
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
    console.log('Params & Queries Challenge Server');
    console.log('='.repeat(50));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nMain Task Route:');
    console.log('  GET /users/:id?active=true&fields=name,email&limit=10&page=1');
    console.log('\nAdditional Routes:');
    console.log('  GET  /users                 - Get all users with filtering');
    console.log('  POST /users                 - Create new user');
    console.log('\nExamples:');
    console.log('  curl http://localhost:3001/users/1?active=true');
    console.log('  curl http://localhost:3001/users/2?active=false&fields=name,email');
    console.log('  curl http://localhost:3001/users?active=true&search=alice&sort=name');
    console.log('  curl -X POST http://localhost:3001/users \\');
    console.log('       -H "Content-Type: application/json" \\');
    console.log('       -d \'{"name":"John","email":"john@example.com","active":true}\'');
    console.log('='.repeat(50));
});
