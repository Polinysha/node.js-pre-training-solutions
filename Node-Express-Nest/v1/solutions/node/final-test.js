const MessageSystem = require('./perfect-task-01');

const system = new MessageSystem();

console.log('=== Testing MessageSystem ===');

system.addUser('Alice');
system.addUser('Bob');
console.log('Users added:', system.getActiveUsers());
console.log('User count:', system.getUserCount());

system.sendMessage('message', 'Hello!', 'Alice');
system.sendMessage('notification', 'Update available', 'System');
system.sendMessage('alert', 'Warning!', 'System');

system.subscribeToMessages((msg) => {
  console.log('All messages:', msg.content);
});

system.subscribeToType('alert', (msg) => {
  console.log('Alert received:', msg.content);
});

const stats = system.getStats();
console.log('Stats:', stats);
console.log('activeUsers is number:', typeof stats.activeUsers === 'number');

console.log('Message history length:', system.getMessageHistory().length);
console.log('Last 2 messages:', system.getMessageHistory(2).length);

system.removeUser('Alice');
console.log('After removal - Users:', system.getActiveUsers());
console.log('After removal - User count:', system.getUserCount());

console.log('=== All tests completed ===');
