=== TASK 07: ORM SETUP SOLUTION ===

// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false }
}, {
  tableName: 'users',
  timestamps: true
});

// models/todo.js  
const Todo = sequelize.define('Todo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  due_date: { type: DataTypes.DATEONLY },
  priority: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
  tableName: 'todos',
  timestamps: true
});

// Установка отношений
User.hasMany(Todo, { foreignKey: 'user_id' });
Todo.belongsTo(User, { foreignKey: 'user_id' });

Файл: src/models/index.js, src/models/user.js, src/models/todo.js
