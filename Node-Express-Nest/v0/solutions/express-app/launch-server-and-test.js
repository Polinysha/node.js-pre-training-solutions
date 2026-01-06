const { spawn } = require('child_process');
const http = require('http');

console.log('. Запускаем Express сервер...');

const server = spawn('node', ['index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
});

server.stdout.on('data', (data) => {
    console.log(\[SERVER]: \\);
});

server.stderr.on('data', (data) => {
    console.error(\[SERVER ERROR]: \\);
});

function waitForServer(retries = 10, delay = 1000) {
    return new Promise((resolve, reject) => {
        function attempt(attemptCount) {
            const req = http.request({
                hostname: 'localhost',
                port: 3000,
                path: '/',
                method: 'GET',
                timeout: 1000
            }, (res) => {
                res.on('data', () => {});
                res.on('end', () => {
                    console.log(\. Сервер запущен и отвечает (попытка \)\);
                    resolve();
                });
            });
            
            req.on('error', (err) => {
                if (attemptCount >= retries) {
                    reject(new Error(\Сервер не запустился после \ попыток\));
                } else {
                    console.log(\. Ожидаем сервер... (\/\)\);
                    setTimeout(() => attempt(attemptCount + 1), delay);
                }
            });
            
            req.on('timeout', () => {
                req.destroy();
                if (attemptCount >= retries) {
                    reject(new Error('Таймаут ожидания сервера'));
                } else {
                    console.log(\. Таймаут, пробуем еще... (\/\)\);
                    setTimeout(() => attempt(attemptCount + 1), delay);
                }
            });
            
            req.end();
        }
        
        attempt(1);
    });
}

async function main() {
    try {

        await waitForServer();
        
        console.log('\n Запускаем тесты...');
        
        const testProcess = spawn('node', ['quick-test.js'], {
            stdio: 'inherit',
            shell: true
        });
        
        testProcess.on('close', (code) => {
            console.log(\\n. Тесты завершены с кодом: \\);
            console.log('\n. РУКОВОДСТВО ПО ИСПОЛЬЗОВАНИЮ:');
            console.log('1. GET /todos              - все задачи');
            console.log('2. POST /todos             - создать задачу');
            console.log('3. GET /todos/1            - задача по ID');
            console.log('4. GET /todos/search       - поиск задач');
            console.log('5. GET /static/            - статические файлы');
            console.log('\n Для остановки сервера нажмите Ctrl+C');
        });
        
    } catch (error) {
        console.error('. Ошибка:', error.message);
        server.kill();
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('\n Останавливаем сервер...');
    server.kill();
    process.exit(0);
});

main();
