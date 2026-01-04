const Redis = require('ioredis');
const { Sequelize } = require('sequelize');
const User = require('./models/user');
const Todo = require('./models/todo');

// Настройка подключений
const sequelize = new Sequelize('todo_app', 'postgres', 'mysecretpassword', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

const CACHE_TTL = 300; // 5 минут в секундах

class TodoCache {
  constructor() {
    this.redis = redis;
  }

  // Генерация ключа для кэша пользователя
  getUserTodosKey(userId) {
    return \	odos:user:\\;
  }

  // Получение задач пользователя с кэшированием
  async getUserTodos(userId) {
    const cacheKey = this.getUserTodosKey(userId);
    
    try {
      // 1. Проверка кэша
      const cachedData = await this.redis.get(cacheKey);
      
      if (cachedData) {
        console.log(\Cache HIT for user \\);
        return JSON.parse(cachedData);
      }

      // 2. Кэш промах - получение из БД
      console.log(\Cache MISS for user \\);
      
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const todos = await Todo.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']],
        raw: true
      });

      const result = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        todos: todos,
        count: todos.length,
        timestamp: new Date().toISOString()
      };

      // 3. Сохранение в кэш с TTL
      await this.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      console.log(\Data cached for user \ with TTL \s\);

      return result;

    } catch (error) {
      console.error('Error in getUserTodos:', error);
      throw error;
    }
  }

  // Инвалидация кэша при изменениях
  async invalidateUserCache(userId) {
    const cacheKey = this.getUserTodosKey(userId);
    await this.redis.del(cacheKey);
    console.log(\Cache invalidated for user \\);
  }

  // Создание задачи с инвалидацией кэша
  async createTodo(userId, todoData) {
    try {
      const todo = await Todo.create({
        ...todoData,
        userId: userId
      });

      // Инвалидация кэша
      await this.invalidateUserCache(userId);
      console.log(\Todo created and cache invalidated for user \\);

      return todo;

    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  // Обновление задачи с инвалидацией кэша
  async updateTodo(todoId, updateData) {
    try {
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
        throw new Error('Todo not found');
      }

      await todo.update(updateData);

      // Инвалидация кэша пользователя
      await this.invalidateUserCache(todo.userId);
      console.log(\Todo updated and cache invalidated for user \\);

      return todo;

    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // Удаление задачи с инвалидацией кэша
  async deleteTodo(todoId) {
    try {
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
        throw new Error('Todo not found');
      }

      const userId = todo.userId;
      await todo.destroy();

      // Инвалидация кэша пользователя
      await this.invalidateUserCache(userId);
      console.log(\Todo deleted and cache invalidated for user \\);

      return true;

    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // Проверка TTL ключа
  async getCacheTTL(userId) {
    const cacheKey = this.getUserTodosKey(userId);
    const ttl = await this.redis.ttl(cacheKey);
    return ttl;
  }

  // Очистка всех кэшей
  async clearAllCache() {
    const keys = await this.redis.keys('todos:user:*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    console.log(\Cleared \ cache keys\);
  }

  // Закрытие соединений
  async close() {
    await this.redis.quit();
    await sequelize.close();
  }
}

async function demonstrateCaching() {
  const todoCache = new TodoCache();

  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    await todoCache.redis.ping();
    console.log('Redis connection established');

    // Получение тестового пользователя
    const testUser = await User.findOne({ 
      where: { username: 'john_doe' },
      raw: true 
    });

    if (!testUser) {
      console.log('Test user not found, exiting');
      return;
    }

    const userId = testUser.id;
    console.log(\\n=== Testing with user: \ (ID: \) ===\n\);

    // Демонстрация 1: Первый запрос (кэш промах)
    console.log('1. First request (cache miss expected):');
    const result1 = await todoCache.getUserTodos(userId);
    console.log(\Retrieved \ todos\);

    // Демонстрация 2: Второй запрос (кэш попадание)
    console.log('\n2. Second request (cache hit expected):');
    const result2 = await todoCache.getUserTodos(userId);
    console.log(\Retrieved \ todos from cache\);

    // Проверка TTL
    const ttl = await todoCache.getCacheTTL(userId);
    console.log(\Cache TTL: \ seconds\);

    // Демонстрация 3: Создание задачи (инвалидация кэша)
    console.log('\n3. Creating new todo (cache invalidation):');
    const newTodo = await todoCache.createTodo(userId, {
      title: 'Cached Task',
      description: 'Task to demonstrate cache invalidation',
      status: 'active'
    });
    console.log(\Created todo ID: \\);

    // Демонстрация 4: Запрос после инвалидации (кэш промах)
    console.log('\n4. Request after cache invalidation (cache miss expected):');
    const result3 = await todoCache.getUserTodos(userId);
    console.log(\Retrieved \ todos (cache should be repopulated)\);

    // Демонстрация 5: Обновление задачи
    console.log('\n5. Updating todo (cache invalidation):');
    await todoCache.updateTodo(newTodo.id, {
      status: 'completed',
      description: 'Updated cached task'
    });

    // Демонстрация 6: Удаление задачи
    console.log('\n6. Deleting todo (cache invalidation):');
    await todoCache.deleteTodo(newTodo.id);

    // Демонстрация 7: Проверка TTL истечения
    console.log('\n7. Simulating TTL expiration:');
    const smallTtlCache = new TodoCache();
    
    // Устанавливаем маленький TTL для демонстрации
    const testKey = \	odos:user:test-ttl\;
    await redis.setex(testKey, 2, JSON.stringify({ test: 'data' }));
    
    console.log('Data cached with 2 second TTL');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const expiredData = await redis.get(testKey);
    console.log(\After 3 seconds: \\);

    // Очистка тестовых данных
    await redis.del(testKey);
    await todoCache.clearAllCache();

    console.log('\n=== Caching demonstration completed ===\n');

  } catch (error) {
    console.error('Error during caching demonstration:', error);
  } finally {
    await todoCache.close();
  }
}

// Запуск демонстрации
demonstrateCaching();
