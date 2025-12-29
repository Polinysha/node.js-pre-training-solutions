=== TASK 10: REDIS CACHING SOLUTION ===

// Redis клиент
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

// Кэширование списка задач пользователя
async function getUserTodosWithCache(userId) {
  const cacheKey = `user:${userId}:todos`;
  
  // Проверка кэша
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('[CACHE HIT]');
    return JSON.parse(cached);
  }
  
  // Получение из БД
  console.log('[CACHE MISS]');
  const todos = await getUserTodosFromDB(userId);
  
  // Сохранение в кэш на 5 минут
  await redisClient.setEx(cacheKey, 300, JSON.stringify(todos));
  
  return todos;
}

// Очистка кэша при обновлении
async function invalidateUserCache(userId) {
  const cacheKey = `user:${userId}:todos`;
  await redisClient.del(cacheKey);
}

Команды Redis:
docker exec todo-redis redis-cli SET "test" "Hello"
docker exec todo-redis redis-cli GET "test"
docker exec todo-redis redis-cli KEYS "*"

Файл: redis-demo/server.js
