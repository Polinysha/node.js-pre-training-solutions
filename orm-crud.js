const { Sequelize, DataTypes, Op } = require('sequelize');
const User = require('./models/user');
const Todo = require('./models/todo');

const sequelize = new Sequelize('todo_app', 'postgres', 'mysecretpassword', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

async function runCRUDOperations() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    // 1. CREATE - Create a new todo
    console.log('\n=== 1. CREATE OPERATION ===');
    
    const user = await User.findOne({ where: { username: 'john_doe' } });
    
    const newTodo = await Todo.create({
      title: 'Implement CRUD operations',
      description: 'Complete task 08 with ORM CRUD implementation',
      status: 'active',
      userId: user.id
    });
    
    console.log('Created todo with ID:', newTodo.id);
    console.log('Title:', newTodo.title);
    console.log('Status:', newTodo.status);

    // 2. READ - List all todos
    console.log('\n=== 2. READ OPERATION ===');
    
    const allTodos = await Todo.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    console.log('Latest 5 todos:');
    allTodos.forEach(todo => {
      console.log(\ID: \, Title: \, Status: \\);
    });

    // Read with filter by status
    const activeTodos = await Todo.findAll({
      where: { status: 'active' },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(\\nActive todos (total: \):\);
    activeTodos.slice(0, 3).forEach(todo => {
      console.log(\ID: \, Title: \\);
    });

    // Read with filter by user
    const userTodos = await Todo.findAll({
      where: { userId: user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(\\nTodos for user \:\);
    userTodos.forEach(todo => {
      console.log(\ID: \, Title: \, Status: \\);
    });

    // 3. UPDATE - Update a todo
    console.log('\n=== 3. UPDATE OPERATION ===');
    
    const todoToUpdate = await Todo.findByPk(newTodo.id);
    
    await todoToUpdate.update({
      status: 'completed',
      description: 'CRUD operations implemented successfully'
    });
    
    const updatedTodo = await Todo.findByPk(newTodo.id);
    console.log('Updated todo:');
    console.log('ID:', updatedTodo.id);
    console.log('Title:', updatedTodo.title);
    console.log('Status:', updatedTodo.status);
    console.log('Description:', updatedTodo.description);

    // Update multiple todos
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
    
    console.log(\Updated \ old active todos to pending\);

    // 4. DELETE - Delete a todo
    console.log('\n=== 4. DELETE OPERATION ===');
    
    const todoToDelete = await Todo.findOne({
      where: { title: 'Implement CRUD operations' }
    });
    
    if (todoToDelete) {
      await todoToDelete.destroy();
      console.log('Deleted todo with ID:', todoToDelete.id);
    }

    // Delete multiple todos
    const deleteResult = await Todo.destroy({
      where: {
        status: 'pending',
        createdAt: {
          [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    console.log(\Deleted \ old pending todos\);

    // Verification
    console.log('\n=== FINAL VERIFICATION ===');
    
    const finalStats = await Todo.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    
    console.log('Current todo statistics:');
    finalStats.forEach(stat => {
      console.log(\\: \ todos\);
    });

    console.log('\nCRUD operations completed successfully');

  } catch (error) {
    console.error('Error during CRUD operations:', error);
  } finally {
    await sequelize.close();
  }
}

runCRUDOperations();
