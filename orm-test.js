const { Sequelize, DataTypes } = require('sequelize');
const User = require('./models/user');
const Todo = require('./models/todo');

// Конфигурация Sequelize
const sequelize = new Sequelize('todo_app', 'postgres', 'mysecretpassword', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});

// Асинхронная функция для тестирования
async function testORM() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД установлено успешно');

    // Тест 1: Получить всех пользователей с их задачами
    const usersWithTodos = await User.findAll({
      include: [{
        model: Todo,
        as: 'todos'
      }]
    });

    console.log('\n=== Пользователи и их задачи ===');
    for (const user of usersWithTodos) {
      console.log(\\nПользователь: \ (\)\);
      console.log(\Всего задач: \\);
      
      const completed = user.todos.filter(t => t.status === 'completed').length;
      const active = user.todos.filter(t => t.status === 'active').length;
      const pending = user.todos.filter(t => t.status === 'pending').length;
      
      console.log(\Завершено: \, Активно: \, В ожидании: \\);
      
      for (const todo of user.todos.slice(0, 2)) {
        console.log(\  - \ [\]\);
      }
      if (user.todos.length > 2) {
        console.log(\  ... и ещё \ задач\);
      }
    }

    // Тест 2: Создать нового пользователя и задачу
    const newUser = await User.create({
      username: 'test_user_orm',
      email: 'test_orm@example.com'
    });

    console.log(\\n=== Создан новый пользователь: ID=\\);

    const newTodo = await Todo.create({
      title: 'Тестовая задача через ORM',
      description: 'Создана с помощью Sequelize',
      status: 'active',
      userId: newUser.id
    });

    console.log(\Создана новая задача: ID=\\);

    // Тест 3: Обновить задачу
    await newTodo.update({
      status: 'completed',
      description: 'Задача выполнена через ORM'
    });

    console.log(\Задача обновлена: статус=\\);

    // Тест 4: Удалить тестовые данные
    await Todo.destroy({
      where: { userId: newUser.id }
    });

    await User.destroy({
      where: { id: newUser.id }
    });

    console.log('\nТестовые данные удалены');

    // Тест 5: Сложные запросы
    const stats = await Todo.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'latest']
      ],
      group: ['status'],
      raw: true
    });

    console.log('\n=== Статистика по статусам задач ===');
    for (const stat of stats) {
      console.log(\\: \ задач, последняя: \\);
    }

    console.log('\n=== Все тесты ORM выполнены успешно ===');

  } catch (error) {
    console.error('Ошибка при работе с ORM:', error);
  } finally {
    await sequelize.close();
  }
}

// Запускаем тест
testORM();
