const EventEmitter = require('events');

class MessagingSystem extends EventEmitter {
  constructor() {
    super();
    this.activeUsers = new Set();
    this.messageHistory = [];
    this.MAX_HISTORY = 10;
  }

  addUser(username) {
    if (typeof username !== 'string' || username.trim() === '') {
      throw new Error('Username must be a non-empty string');
    }
    if (this.activeUsers.has(username)) {
      return false; 
    }
    this.activeUsers.add(username);
    this.emit('user-joined', { username, timestamp: new Date() });
    return true;
  }

  removeUser(username) {
    if (this.activeUsers.delete(username)) {
      this.emit('user-left', { username, timestamp: new Date() });
      return true;
    }
    return false;
  }

  getActiveUsers() {
    return [...this.activeUsers];
  }

  getUserCount() {
    return this.activeUsers.size;
  }

  sendMessage(type, content, sender = 'system') {
    const validTypes = ['message', 'notification', 'alert'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid message type. Allowed: ${validTypes.join(', ')}`);
    }
    if (typeof content !== 'string' || content.trim() === '') {
      throw new Error('Content must be a non-empty string');
    }

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      type,
      content: content.trim(),
      timestamp: new Date(),
      sender
    };

    this.messageHistory.push(message);
    if (this.messageHistory.length > this.MAX_HISTORY) {
      this.messageHistory.shift();
    }

    this.emit('message', message);
    this.emit(type, message);

    return message.id;
  }

  subscribeToMessages(callback) {
    this.on('message', callback);
  }

  subscribeToType(type, callback) {
    this.on(type, callback);
  }

  getMessageHistory() {
    return [...this.messageHistory];
  }

  clearHistory() {
    this.messageHistory = [];
    this.emit('history-cleared');
  }

  getStats() {
    return {
      userCount: this.getUserCount(),
      messageCount: this.messageHistory.length,
      historySize: this.MAX_HISTORY
    };
  }
}
