=== TASK 08: ORM CRUD OPERATIONS ===

1. IMPLEMENTATION FILE: orm-crud.js

2. CREATE OPERATION:

const newTodo = await Todo.create({
  title: 'Implement CRUD operations',
  description: 'Complete task 08 with ORM CRUD implementation',
  status: 'active',
  userId: user.id
});

Result: Creates new todo with auto-generated ID, timestamps.

3. READ OPERATIONS:

3.1 Read all todos (with limit and ordering):
const allTodos = await Todo.findAll({
  order: [['createdAt', 'DESC']],
  limit: 5
});

3.2 Read with filter by status:
const activeTodos = await Todo.findAll({
  where: { status: 'active' },
  order: [['createdAt', 'DESC']]
});

3.3 Read with filter by user and join:
const userTodos = await Todo.findAll({
  where: { userId: user.id },
  include: [{
    model: User,
    as: 'user',
    attributes: ['username', 'email']
  }],
  order: [['createdAt', 'DESC']]
});

4. UPDATE OPERATIONS:

4.1 Update single todo:
const todoToUpdate = await Todo.findByPk(todoId);
await todoToUpdate.update({
  status: 'completed',
  description: 'Updated description'
});

4.2 Update multiple todos:
const updateResult = await Todo.update(
  { status: 'pending' },
  {
    where: {
      status: 'active',
      createdAt: {
        [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  }
);

5. DELETE OPERATIONS:

5.1 Delete single todo:
const todoToDelete = await Todo.findByPk(todoId);
await todoToDelete.destroy();

5.2 Delete multiple todos:
const deleteResult = await Todo.destroy({
  where: {
    status: 'pending',
    createdAt: {
      [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  }
});

6. CRUD VERIFICATION:

Final statistics query:
const finalStats = await Todo.findAll({
  attributes: [
    'status',
    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
  ],
  group: ['status'],
  raw: true
});

7. EXECUTION COMMANDS:

node orm-crud.js

8. TEST RESULTS:

Database connection established
Created todo with ID: [generated_id]
Listed latest 5 todos
Filtered todos by status and user
Updated todo successfully
Deleted todo with ID: [deleted_id]
Displayed final statistics

9. GIT INTEGRATION:

Files modified/created:
- orm-crud.js (CRUD implementation)
- DB/solutions/task-08.sql (documentation)

Commit these files with message: "Task 08: Implement ORM CRUD operations"

10. DATABASE VERIFICATION:

Check todos count after operations:
docker exec todo-postgres psql -U postgres -d todo_app -c "SELECT status, COUNT(*) FROM \"Todos\" GROUP BY status;"

Check recent todo operations:
docker exec todo-postgres psql -U postgres -d todo_app -c "SELECT id, title, status, \"createdAt\" FROM \"Todos\" ORDER BY \"createdAt\" DESC LIMIT 5;"
