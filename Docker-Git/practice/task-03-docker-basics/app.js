const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello Docker! This is my first containerized Node.js application.\n');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(\Server running at http://localhost:\\);
});
