// redis-test.js - Test Redis connection
const redis = require('redis');

async function testRedis() {
    const client = redis.createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();
    
    console.log('Testing Redis connection...');
    
    // Set and get a value
    await client.set('key', 'Hello from Redis!');
    const value = await client.get('key');
    console.log('Redis value:', value);
    
    // List all keys
    const keys = await client.keys('*');
    console.log('All keys:', keys);
    
    await client.disconnect();
    console.log('Redis test completed');
}

testRedis().catch(console.error);
