const MessageSystem = require('./perfect-task-01');

const system = new MessageSystem();

// Test all functionality
console.log('=== Testing MessageSystem ===');

// Test user management
system.addUser('Alice');
system.addUser('Bob');
console.log('Users added:', system.getActiveUsers());
console.log('User count:', system.getUserCount());

// Test messaging
system.sendMessage('message', 'Hello!', 'Alice');
system.sendMessage('notification', 'Update available', 'System');
system.sendMessage('alert', 'Warning!', 'System');

// Test subscriptions
system.subscribeToMessages((msg) => {
  console.log('All messages:', msg.content);
});

system.subscribeToType('alert', (msg) => {
  console.log('Alert received:', msg.content);
});

// Test stats
const stats = system.getStats();
console.log('Stats:', stats);
console.log('activeUsers is number:', typeof stats.activeUsers === 'number');

// Test message history
console.log('Message history length:', system.getMessageHistory().length);
console.log('Last 2 messages:', system.getMessageHistory(2).length);

// Test user removal
system.removeUser('Alice');
console.log('After removal - Users:', system.getActiveUsers());
console.log('After removal - User count:', system.getUserCount());

console.log('=== All tests completed ===');
