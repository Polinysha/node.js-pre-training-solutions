const Redis = require('ioredis');
const { Sequelize } = require('sequelize');
const User = require('./models/user');
const Todo = require('./models/todo');

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

const CACHE_TTL = 300; 

class TodoCache {
  constructor() {
    this.redis = redis;
  }

  getUserTodosKey(userId) {
    return \	odos:user:\\;
  }

  async getUserTodos(userId) {
    const cacheKey = this.getUserTodosKey(userId);
    
    try {
      const cachedData = await this.redis.get(cacheKey);
      
      if (cachedData) {
        console.log(\Cache HIT for user \\);
        return JSON.parse(cachedData);
      }

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

      await this.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      console.log(\Data cached for user \ with TTL \s\);

      return result;

    } catch (error) {
      console.error('Error in getUserTodos:', error);
      throw error;
    }
  }

  async invalidateUserCache(userId) {
    const cacheKey = this.getUserTodosKey(userId);
    await this.redis.del(cacheKey);
    console.log(\Cache invalidated for user \\);
  }

  async createTodo(userId, todoData) {
    try {
      const todo = await Todo.create({
        ...todoData,
        userId: userId
      });

      await this.invalidateUserCache(userId);
      console.log(\Todo created and cache invalidated for user \\);

      return todo;

    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  async updateTodo(todoId, updateData) {
    try {
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
        throw new Error('Todo not found');
      }

      await todo.update(updateData);

      await this.invalidateUserCache(todo.userId);
      console.log(\Todo updated and cache invalidated for user \\);

      return todo;

    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async deleteTodo(todoId) {
    try {
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
        throw new Error('Todo not found');
      }

      const userId = todo.userId;
      await todo.destroy();

      await this.invalidateUserCache(userId);
      console.log(\Todo deleted and cache invalidated for user \\);

      return true;

    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  async getCacheTTL(userId) {
    const cacheKey = this.getUserTodosKey(userId);
    const ttl = await this.redis.ttl(cacheKey);
    return ttl;
  }

  async clearAllCache() {
    const keys = await this.redis.keys('todos:user:*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    console.log(\Cleared \ cache keys\);
  }

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

    console.log('1. First request (cache miss expected):');
    const result1 = await todoCache.getUserTodos(userId);
    console.log(\Retrieved \ todos\);

    console.log('\n2. Second request (cache hit expected):');
    const result2 = await todoCache.getUserTodos(userId);
    console.log(\Retrieved \ todos from cache\);

    const ttl = await todoCache.getCacheTTL(userId);
    console.log(\Cache TTL: \ seconds\);

    console.log('\n3. Creating new todo (cache invalidation):');
    const newTodo = await todoCache.createTodo(userId, {
      title: 'Cached Task',
      description: 'Task to demonstrate cache invalidation',
      status: 'active'
    });
    console.log(\Created todo ID: \\);

    console.log('\n4. Request after cache invalidation (cache miss expected):');
    const result3 = await todoCache.getUserTodos(userId);
    console.log(\Retrieved \ todos (cache should be repopulated)\);

    console.log('\n5. Updating todo (cache invalidation):');
    await todoCache.updateTodo(newTodo.id, {
      status: 'completed',
      description: 'Updated cached task'
    });

    console.log('\n6. Deleting todo (cache invalidation):');
    await todoCache.deleteTodo(newTodo.id);

    console.log('\n7. Simulating TTL expiration:');
    const smallTtlCache = new TodoCache();
    
    const testKey = \	odos:user:test-ttl\;
    await redis.setex(testKey, 2, JSON.stringify({ test: 'data' }));
    
    console.log('Data cached with 2 second TTL');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const expiredData = await redis.get(testKey);
    console.log(\After 3 seconds: \\);

    await redis.del(testKey);
    await todoCache.clearAllCache();

    console.log('\n=== Caching demonstration completed ===\n');

  } catch (error) {
    console.error('Error during caching demonstration:', error);
  } finally {
    await todoCache.close();
  }
}

demonstrateCaching();
