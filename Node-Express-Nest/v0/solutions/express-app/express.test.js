const request = require('supertest');

// ???? ????????????? ??????????
delete require.cache[require.resolve('./index')];
const app = require('./index');

describe('Task 1: GET /todos', () => {
  test('responds with a list of todos', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('Task 2: POST /todos', () => {
  test('creates a new todo and returns it', async () => {
    const newTodo = { title: 'Test todo' };
    const response = await request(app).post('/todos').send(newTodo);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.completed).toBe(false);
  });

  test('returns 400 if title is missing', async () => {
    const response = await request(app).post('/todos').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Task 10: GET /todos/search', () => {
  test('filters todos by completed=true', async () => {
    const response = await request(app).get('/todos/search?completed=true');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // ?????????, ??? ??? ????????? todos ????? completed: true
    if (response.body.length > 0) {
      response.body.forEach(todo => {
        expect(todo.completed).toBe(true);
      });
    }
  });

  test('filters todos by completed=false', async () => {
    const response = await request(app).get('/todos/search?completed=false');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // ?????????, ??? ??? ????????? todos ????? completed: false
    if (response.body.length > 0) {
      response.body.forEach(todo => {
        expect(todo.completed).toBe(false);
      });
    }
  });

  test('returns 400 for invalid completed value', async () => {
    const response = await request(app).get('/todos/search?completed=invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Task 4: GET /todos/:id', () => {
  test('returns todo by id', async () => {
    const response = await request(app).get('/todos/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  test('returns 404 for non-existent id', async () => {
    const response = await request(app).get('/todos/9999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Task 7: Error Handler', () => {
  test('returns JSON error for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('handles thrown errors with JSON response', async () => {
    const response = await request(app).get('/test-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Test error for Task 7');
  });
});

describe('Root endpoint', () => {
  test('returns API information', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('endpoints');
  });
});
