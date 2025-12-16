const http = require('http');
const url = require('url');

function testEndpoint(queryParam) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/todos/search${queryParam ? '?' + queryParam : ''}`,
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
            statusCode: res.statusCode,
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

async function runTests() {
  console.log('Starting server...\n');
  
  // ????????? ??????
  const app = require('./index');
  const server = app.listen(3000, async () => {
    console.log('Server started on port 3000\n');
    
    try {
      console.log('=== Test 1: completed=true ===');
      const result1 = await testEndpoint('completed=true');
      console.log('Status:', result1.statusCode);
      console.log('Body:', JSON.stringify(result1.body, null, 2));
      
      console.log('\n=== Test 2: completed=false ===');
      const result2 = await testEndpoint('completed=false');
      console.log('Status:', result2.statusCode);
      console.log('Body:', JSON.stringify(result2.body, null, 2));
      
      console.log('\n=== Test 3: invalid value ===');
      const result3 = await testEndpoint('completed=invalid');
      console.log('Status:', result3.statusCode);
      console.log('Body:', JSON.stringify(result3.body, null, 2));
      
      console.log('\n=== Test 4: no parameter ===');
      const result4 = await testEndpoint('');
      console.log('Status:', result4.statusCode);
      console.log('Body length:', result4.body.length);
      
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      server.close(() => {
        console.log('\nServer stopped');
        process.exit(0);
      });
    }
  });
}

runTests().catch(console.error);
