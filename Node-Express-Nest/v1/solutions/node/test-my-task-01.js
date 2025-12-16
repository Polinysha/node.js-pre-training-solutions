const MessageEmitter = require('./my-task-01');

const emitter = new MessageEmitter();

emitter.subscribeToMessages((message) => {
  console.log('All messages:', message.content);
});

emitter.subscribeToType('notification', (message) => {
  console.log('Notification:', message.content);
});

emitter.subscribeToType('alert', (message) => {
  console.log('Alert:', message.content);
});

emitter.subscribeToType('user-joined', (message) => {
  console.log('User joined:', message.content);
});

emitter.subscribeToType('user-left', (message) => {
  console.log('User left:', message.content);
});

console.log('Testing Message Emitter');

emitter.addUser('Alice');
emitter.addUser('Bob');

emitter.sendMessage('message', 'Hello world!', 'Alice');
emitter.sendMessage('notification', 'System update available', 'System');
emitter.sendMessage('alert', 'High CPU usage detected', 'System');
emitter.sendMessage('message', 'How are you?', 'Bob');

emitter.removeUser('Alice');

console.log('Stats:');
console.log(emitter.getStats());

console.log('Message History:');
console.log(emitter.getMessageHistory());

console.log('Active Users:');
console.log(emitter.getActiveUsers());
