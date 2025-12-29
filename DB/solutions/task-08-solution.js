=== TASK 08: ORM CRUD SOLUTION ===

// CREATE
const user = await User.create({
  username: 'test_user',
  email: 'test@example.com',
  password_hash: 'test_hash'
});

const todo = await Todo.create({
  title: 'Test Todo',
  description: 'Created with ORM',
  user_id: user.id
});

// READ
const users = await User.findAll();
const todos = await Todo.findAll({
  where: { user_id: 1 },
  include: [{ model: User }]
});

// UPDATE
await todo.update({
  is_completed: true,
  priority: 1
});

// DELETE
await todo.destroy();

Файл: src/task-08-crud.js
