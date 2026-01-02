// server.js - Simple Node.js server for Docker practice
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Node.js container!\n' +
            'Container ID: ' + process.env.HOSTNAME + '\n' +
            'Time: ' + new Date().toISOString());
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(\Node.js server running on port \\);
    console.log('Press Ctrl+C to stop');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
