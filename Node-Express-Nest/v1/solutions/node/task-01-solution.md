# Task 01 Solution: Custom Event Emitter

## Implementation Details

### Class: MessageSystem
Extends Node.js EventEmitter to create a custom pub-sub messaging system.

### Key Features:
- Message sending with different types (message, notification, alert, user-joined, user-left)
- User management (add/remove users)
- Message history with limit of 10 messages
- Statistics collection
- Event subscriptions for specific message types

### Methods Implemented:
- `sendMessage(type, content, sender)` - Send messages
- `subscribeToMessages(callback)` - Subscribe to all messages
- `subscribeToType(type, callback)` - Subscribe to specific type
- `addUser(username)` / `removeUser(username)` - User management
- `getMessageHistory(count)` - Get message history
- `getStats()` - Get system statistics
- `getActiveUsers()` - Get list of active users

### Testing:
All 8 tests passed successfully.

## How to Run
\`\`\`bash
node task-01-test.js
\`\`\`

## Files:
- `task-01.js` - Main implementation
- `task-01-test.js` - Test suite
