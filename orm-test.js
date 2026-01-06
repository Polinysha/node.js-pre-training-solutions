const { Sequelize, DataTypes } = require('sequelize');
const User = require('./models/user');
const Todo = require('./models/todo');

const sequelize = new Sequelize('todo_app', 'postgres', 'mysecretpassword', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});

async function testORM() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    const usersWithTodos = await User.findAll({
      include: [{
        model: Todo,
        as: 'todos'
      }]
    });

    console.log('\n=== Users and their todos ===');
    for (const user of usersWithTodos) {
      console.log(`\nUser: ${user.username} (${user.email})`);
      console.log(`Total todos: ${user.todos.length}`);
      
      const completed = user.todos.filter(t => t.status === 'completed').length;
      const active = user.todos.filter(t => t.status === 'active').length;
      const pending = user.todos.filter(t => t.status === 'pending').length;
      
      console.log(`Completed: ${completed}, Active: ${active}, Pending: ${pending}`);
      
      for (const todo of user.todos.slice(0, 2)) {
        console.log(`  - ${todo.title} [${todo.status}]`);
      }
      if (user.todos.length > 2) {
        console.log(`  ... and ${user.todos.length - 2} more tasks`);
      }
    }

    const newUser = await User.create({
      username: 'test_user_orm',
      email: 'test_orm@example.com'
    });

    console.log(`\n=== Created new user: ID=${newUser.id} ===`);

    const newTodo = await Todo.create({
      title: 'Test task via ORM',
      description: 'Created using Sequelize',
      status: 'active',
      userId: newUser.id
    });

    console.log(`Created new todo: ID=${newTodo.id}`);

    await newTodo.update({
      status: 'completed',
      description: 'Task completed via ORM'
    });

    console.log(`Todo updated: status=${newTodo.status}`);

    await Todo.destroy({
      where: { userId: newUser.id }
    });

    await User.destroy({
      where: { id: newUser.id }
    });

    console.log('\nTest data cleaned up');

    const stats = await Todo.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'latest']
      ],
      group: ['status'],
      raw: true
    });

    console.log('\n=== Task status statistics ===');
    for (const stat of stats) {
      console.log(`${stat.status}: ${stat.count} tasks, latest: ${stat.latest}`);
    }

    console.log('\n=== All ORM tests completed successfully ===');

  } catch (error) {
    console.error('Error while working with ORM:', error);
  } finally {
    await sequelize.close();
  }
}

testORM();
