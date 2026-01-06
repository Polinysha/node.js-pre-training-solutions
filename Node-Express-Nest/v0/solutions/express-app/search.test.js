const request = require('supertest');

delete require.cache[require.resolve('./index')];
const app = require('./index');

describe('Task 10: GET /todos/search', () => {
  test('responds with array for completed=true', async () => {
    const response = await request(app).get('/todos/search?completed=true');
    console.log('\n=== DEBUG TEST ===');
    console.log('URL: /todos/search?completed=true');
    console.log('Response status:', response.status);
    console.log('Response body length:', response.body.length);
    console.log('Response body:', JSON.stringify(response.body, null, 2));
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    if (response.body.length > 0) {
      response.body.forEach(todo => {
        expect(todo.completed).toBe(true);
      });
    }
  });

  test('responds with array for completed=false', async () => {
    const response = await request(app).get('/todos/search?completed=false');
    console.log('\n=== DEBUG TEST ===');
    console.log('URL: /todos/search?completed=false');
    console.log('Response status:', response.status);
    console.log('Response body length:', response.body.length);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    if (response.body.length > 0) {
      response.body.forEach(todo => {
        expect(todo.completed).toBe(false);
      });
    }
  });

  test('returns 400 for invalid completed value', async () => {
    const response = await request(app).get('/todos/search?completed=invalid');
    console.log('\n=== DEBUG TEST ===');
    console.log('URL: /todos/search?completed=invalid');
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(response.body, null, 2));
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
