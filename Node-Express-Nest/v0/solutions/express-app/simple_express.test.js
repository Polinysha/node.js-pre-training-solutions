const request = require('supertest');
const app = require('./simple_index');

describe('Simple search test', () => {
  test('responds with array for completed=true', async () => {
    const response = await request(app).get('/todos/search?completed=true');
    console.log('Simple test - Status:', response.status);
    console.log('Simple test - Body:', JSON.stringify(response.body));
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('responds with array for completed=false', async () => {
    const response = await request(app).get('/todos/search?completed=false');
    console.log('Simple test - Status:', response.status);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
