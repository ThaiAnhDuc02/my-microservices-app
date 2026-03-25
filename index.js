const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from my-app v3.0 - Testing Jenkins auto-build!\n');
});

server.listen(3000, () => {
  console.log('Server running on port 3000 - Build test');
});
