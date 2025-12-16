const MessageSystem = require('./perfect-task-01');

const system = new MessageSystem();

// Send different types of messages
system.sendMessage('message', 'Hello!', 'User1');
system.sendMessage('notification', 'Update!', 'System');
system.sendMessage('alert', 'Warning!', 'System');
system.sendMessage('message', 'Hi again!', 'User2');
system.sendMessage('notification', 'News!', 'System');

// Check stats
const stats = system.getStats();
console.log('Stats:', stats);
console.log('messagesByType is object:', typeof stats.messagesByType === 'object');
console.log('Message count:', stats.messagesByType.message);
console.log('Notification count:', stats.messagesByType.notification);
console.log('Alert count:', stats.messagesByType.alert);
