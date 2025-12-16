const http = require('http');
const app = require('./index');

// ???????? ?????? ?? ????????? ?????
const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Test server started on port ${port}\n`);
  
  try {
    // ???? 1: completed=true
    console.log('=== Test 1: GET /todos/search?completed=true ===');
    const result1 = await makeRequest(port, '/todos/search?completed=true');
    console.log('Status:', result1.status);
    console.log('Body:', JSON.stringify(result1.body, null, 2));
    
    // ???? 2: completed=false
    console.log('\n=== Test 2: GET /todos/search?completed=false ===');
    const result2 = await makeRequest(port, '/todos/search?completed=false');
    console.log('Status:', result2.status);
    console.log('Body:', JSON.stringify(result2.body, null, 2));
    
    // ???? 3: ??? ?????????
    console.log('\n=== Test 3: GET /todos/search ===');
    const result3 = await makeRequest(port, '/todos/search');
    console.log('Status:', result3.status);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    server.close();
    console.log('\nServer stopped');
  }
});

function makeRequest(port, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            body: parsedData
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
