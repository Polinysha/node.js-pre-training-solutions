const EventEmitter = require('events');

class MessageEmitter extends EventEmitter {
  constructor() {
    super();
    this.messages = [];
    this.users = new Set();
    this.stats = {
      totalMessages: 0,
      totalUsers: 0
    };
  }

  sendMessage(type, content, sender) {
    const message = {
      id: Date.now().toString(),
      type: type,
      content: content,
      timestamp: new Date(),
      sender: sender || 'System'
    };

    this.messages.push(message);
    this.stats.totalMessages++;

    // Keep only last 10 messages
    if (this.messages.length > 10) {
      this.messages = this.messages.slice(-10);
    }

    this.emit(type, message);
    this.emit('message', message);

    return message;
  }

  subscribeToMessages(callback) {
    this.on('message', callback);
  }

  subscribeToType(type, callback) {
    this.on(type, callback);
  }

  getUserCount() {
    return this.users.size;
  }

  getMessageHistory() {
    return this.messages;
  }

  clearHistory() {
    this.messages = [];
  }

  getStats() {
    return {
      messageCount: this.stats.totalMessages,
      userCount: this.users.size,
      activeUsers: Array.from(this.users),
      historySize: this.messages.length
    };
  }

  addUser(username) {
    if (this.users.has(username)) {
      return false;
    }
    this.users.add(username);
    this.stats.totalUsers++;
    this.emit('user-joined', { username: username });
    return true;
  }

  removeUser(username) {
    if (!this.users.has(username)) {
      return false;
    }
    this.users.delete(username);
    this.emit('user-left', { username: username });
    return true;
  }

  getActiveUsers() {
    return Array.from(this.users);
  }
}

module.exports = MessageEmitter;
