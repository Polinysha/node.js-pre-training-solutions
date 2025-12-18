// test-express-api.js - тестовый скрипт для проверки Express API
const axios = require('axios');
const API_URL = 'http://localhost:3000';

async function testExpressAPI() {
    console.log(' Тестирование Express API...\n');
    
    try {
        console.log('1. Тестируем GET /todos...');
        const getResponse = await axios.get(\\/todos\);
        console.log(' Успех! Получено задач:', getResponse.data.length);
        
        console.log('\n2. Тестируем POST /todos...');
        const newTodo = { title: 'Test task from script', completed: false };
        const postResponse = await axios.post(\\/todos\, newTodo);
        console.log(' Создана новая задача:', postResponse.data);
        
        console.log('\n3. Тестируем GET /todos/:id...');
        const newId = postResponse.data.id;
        const getByIdResponse = await axios.get(\\/todos/\\);
        console.log(' Найдена задача по ID:', getByIdResponse.data);
        
        console.log('\n4. Тестируем поиск /todos/search?completed=false...');
        const searchResponse = await axios.get(\\/todos/search?completed=false\);
        console.log(' Найдено незавершенных задач:', searchResponse.data.length);
        
        console.log('\n Все тесты пройдены успешно!');
        
    } catch (error) {
        console.error('\n Ошибка при тестировании:', error.message);
        if (error.response) {
            console.error('Статус:', error.response.status);
            console.error('Данные:', error.response.data);
        }
    }
}

// Запускаем тест если файл выполняется напрямую
if (require.main === module) {
    testExpressAPI();
}

module.exports = testExpressAPI;
