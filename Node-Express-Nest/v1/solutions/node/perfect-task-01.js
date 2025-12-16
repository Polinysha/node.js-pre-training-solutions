const EventEmitter = require('events');

class MessageSystem extends EventEmitter {
  constructor() {
    super();
    this.messageHistory = [];
    this.activeUsers = new Set();
    this.totalMessages = 0;
    this.messagesByType = {
      'message': 0,
      'notification': 0,
      'alert': 0,
      'user-joined': 0,
      'user-left': 0
    };
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
    
    // Count messages by type
    if (this.messagesByType[type] !== undefined) {
      this.messagesByType[type]++;
    } else {
      this.messagesByType[type] = 1;
    }

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
      activeUsers: this.activeUsers.size,
      historySize: this.messageHistory.length,
      messagesByType: this.messagesByType
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
