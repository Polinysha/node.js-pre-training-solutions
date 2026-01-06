const request = require('supertest');

delete require.cache[require.resolve('./index')];
const app = require('./index');

describe('Task 10: GET /todos/search', () => {
  test('responds with array for completed=true', async () => {
    const response = await request(app).get('/todos/search?completed=true');
    console.log('DEBUG: Response status for completed=true:', response.status);
    console.log('DEBUG: Response body:', JSON.stringify(response.body));
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('responds with array for completed=false', async () => {
    const response = await request(app).get('/todos/search?completed=false');
    console.log('DEBUG: Response status for completed=false:', response.status);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('returns 400 for invalid completed value', async () => {
    const response = await request(app).get('/todos/search?completed=invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Other tests', () => {
  test('GET /todos works', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
  });
});
