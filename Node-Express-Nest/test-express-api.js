const axios = require('axios');
const API_URL = 'http://localhost:3000';

async function testExpressAPI() {
    console.log('Testing Express API...\n');
    
    try {
        console.log('1. Testing GET /todos...');
        const getResponse = await axios.get(`${API_URL}/todos`);
        console.log('Success! Received tasks:', getResponse.data.length);
        
        console.log('\n2. Testing POST /todos...');
        const newTodo = { title: 'Test task from script', completed: false };
        const postResponse = await axios.post(`${API_URL}/todos`, newTodo);
        console.log('Created new task:', postResponse.data);
        
        console.log('\n3. Testing GET /todos/:id...');
        const newId = postResponse.data.id;
        const getByIdResponse = await axios.get(`${API_URL}/todos/${newId}`);
        console.log('Found task by ID:', getByIdResponse.data);
        
        console.log('\n4. Testing search /todos/search?completed=false...');
        const searchResponse = await axios.get(`${API_URL}/todos/search?completed=false`);
        console.log('Found incomplete tasks:', searchResponse.data.length);
        
        console.log('\nAll tests passed successfully!');
        
    } catch (error) {
        console.error('\nError during testing:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

if (require.main === module) {
    testExpressAPI();
}

module.exports = testExpressAPI;
