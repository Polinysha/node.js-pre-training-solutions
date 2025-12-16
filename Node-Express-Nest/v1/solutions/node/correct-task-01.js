const EventEmitter = require('events');

class MessageSystem extends EventEmitter {
  constructor() {
    super();
    this.messageHistory = [];
    this.activeUsers = new Set();
    this.totalMessages = 0;
  }

  sendMessage(type, content, sender = 'System') {
    const message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type: type,
      content: content,
      timestamp: new Date(),
      sender: sender
    };

    this.messageHistory.push(message);
    this.totalMessages++;

    // Keep only last 10 messages
    if (this.messageHistory.length > 10) {
      this.messageHistory.shift();
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
    return this.activeUsers.size;
  }

  getMessageHistory(count = 10) {
    return this.messageHistory.slice(-count);
  }

  clearHistory() {
    this.messageHistory = [];
  }

  getStats() {
    return {
      totalMessages: this.totalMessages,
      userCount: this.activeUsers.size,
      activeUsers: Array.from(this.activeUsers),
      historySize: this.messageHistory.length
    };
  }

  addUser(username) {
    if (this.activeUsers.has(username)) {
      return false;
    }
    this.activeUsers.add(username);
    this.emit('user-joined', { 
      username: username,
      content: username + ' joined the system'
    });
    return true;
  }

  removeUser(username) {
    if (!this.activeUsers.has(username)) {
      return false;
    }
    this.activeUsers.delete(username);
    this.emit('user-left', { 
      username: username,
      content: username + ' left the system'
    });
    return true;
  }

  getActiveUsers() {
    return Array.from(this.activeUsers);
  }
}

module.exports = MessageSystem;
