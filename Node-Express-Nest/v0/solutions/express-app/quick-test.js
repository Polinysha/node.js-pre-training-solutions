const http = require('http');

const testCases = [
    { name: '1. GET /', method: 'GET', path: '/' },
    { name: '2. GET /todos', method: 'GET', path: '/todos' },
    { name: '3. POST /todos', method: 'POST', path: '/todos', data: '{"title":"Test Task","completed":false}' },
    { name: '4. GET /todos/1', method: 'GET', path: '/todos/1' },
    { name: '5. GET /todos/999 (404)', method: 'GET', path: '/todos/999' },
    { name: '6. GET /todos/search', method: 'GET', path: '/todos/search' },
    { name: '7. GET /todos/search?completed=true', method: 'GET', path: '/todos/search?completed=true' },
    { name: '8. GET /static/', method: 'GET', path: '/static/' }
];

function makeRequest(method, path, data = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {}
        };
        
        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }
        
        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        name: \\ \\,
                        status: res.statusCode,
                        data: responseData ? JSON.parse(responseData) : responseData,
                        success: res.statusCode >= 200 && res.statusCode < 300
                    });
                } catch {
                    resolve({
                        name: \\ \\,
                        status: res.statusCode,
                        data: responseData,
                        success: res.statusCode >= 200 && res.statusCode < 300
                    });
                }
            });
        });
        
        req.on('error', () => {
            resolve({
                name: \\ \\,
                status: 0,
                data: 'Connection failed',
                success: false
            });
        });
        
        if (data) req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log(' ТЕСТИРУЕМ ВСЕ ENDPOINT\n');
    
    for (const test of testCases) {
        console.log(\\...\);
        const result = await makeRequest(test.method, test.path, test.data);
        
        if (result.success) {
            console.log(\   . \ - Успех\);
            if (Array.isArray(result.data)) {
                console.log(\      Элементов: \\);
            }
        } else {
            console.log(\   . \ - \\);
        }
        
        await new Promise(r => setTimeout(r, 100));
    }
    
    console.log('\n. ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
    console.log(' Откройте браузер: http://localhost:3000/todos');
}

setTimeout(runTests, 2000);
