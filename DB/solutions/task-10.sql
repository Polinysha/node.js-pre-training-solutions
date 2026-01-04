=== TASK 10: REDIS CACHING IMPLEMENTATION ===

1. REDIS SETUP:

Docker container: redis-cache
Port: 6379
Image: redis:alpine

Commands:
docker run --name redis-cache -p 6379:6379 -d redis:alpine
docker start redis-cache

2. NODE.JS DEPENDENCIES:

npm install redis ioredis

3. IMPLEMENTATION FILE: redis-cache.js

4. CACHE CONFIGURATION:

const CACHE_TTL = 300; // 5 minutes in seconds

Redis key format: todos:user:{userId}

5. CACHE METHODS:

5.1 Get User Todos (with caching):
async getUserTodos(userId) {
  const cacheKey = this.getUserTodosKey(userId);
  
  // 1. Check cache
  const cachedData = await this.redis.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);
  
  // 2. Cache miss - fetch from DB
  const todos = await Todo.findAll({
    where: { userId: userId },
    order: [['createdAt', 'DESC']],
    raw: true
  });
  
  const result = {
    user: { ... },
    todos: todos,
    count: todos.length,
    timestamp: new Date().toISOString()
  };
  
  // 3. Cache with TTL
  await this.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  return result;
}

5.2 Cache Invalidation:
async invalidateUserCache(userId) {
  const cacheKey = this.getUserTodosKey(userId);
  await this.redis.del(cacheKey);
}

5.3 Create Todo with cache invalidation:
async createTodo(userId, todoData) {
  const todo = await Todo.create({ ...todoData, userId });
  await this.invalidateUserCache(userId);
  return todo;
}

5.4 Update Todo with cache invalidation:
async updateTodo(todoId, updateData) {
  const todo = await Todo.findByPk(todoId);
  await todo.update(updateData);
  await this.invalidateUserCache(todo.userId);
  return todo;
}

5.5 Delete Todo with cache invalidation:
async deleteTodo(todoId) {
  const todo = await Todo.findByPk(todoId);
  const userId = todo.userId;
  await todo.destroy();
  await this.invalidateUserCache(userId);
  return true;
}

6. CACHE KEY MANAGEMENT:

Key generation: getUserTodosKey(userId)
Returns: todos:user:{userId}

TTL check: this.redis.ttl(cacheKey)
Returns: remaining seconds or -1/-2

7. TESTING SCENARIOS:

7.1 First request (cache miss):
- Check Redis cache → MISS
- Query database → HIT
- Cache result with TTL
- Return data

7.2 Subsequent request (cache hit):
- Check Redis cache → HIT
- Return cached data immediately

7.3 Data modification (cache invalidation):
- Perform CRUD operation
- Delete user's cache key
- Next request will be cache miss

7.4 TTL expiration:
- Cache automatically expires after TTL
- Next request will be cache miss

8. EXECUTION COMMANDS:

Start Redis: docker start redis-cache
Run demo: node redis-cache.js
Test Redis: docker exec redis-cache redis-cli ping

9. DEMONSTRATION OUTPUT:

Expected output shows:
- Cache miss on first request
- Cache hit on second request
- Cache invalidation on CRUD operations
- TTL expiration demonstration

10. PERFORMANCE CONSIDERATIONS:

- TTL 300 seconds (5 minutes) balances freshness/performance
- JSON serialization for complex data structures
- Error handling for Redis failures
- Connection pooling for production use

11. GIT INTEGRATION:

Files to commit:
- redis-cache.js (caching implementation)
- package.json (updated dependencies)
- DB/solutions/task-10.sql (documentation)

Commit with message: "Task 10: Implement Redis caching for user todos"

12. VERIFICATION:

Redis connection test:
docker exec redis-cache redis-cli ping

Check cached keys:
docker exec redis-cache redis-cli keys 'todos:user:*'

Monitor cache hits/misses via application logs
