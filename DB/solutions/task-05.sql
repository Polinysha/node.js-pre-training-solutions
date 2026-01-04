=== TASK 05: SQL AGGREGATION AND GROUPING ===

1. DATABASE CONNECTION:

docker exec -it todo-postgres psql -U postgres -d todo_app

2. COUNT TODOS BY STATUS:

-- Базовая группировка по статусу
SELECT 
    status,
    COUNT(*) as total_todos
FROM todos
GROUP BY status
ORDER BY total_todos DESC;

-- Группировка по статусу с дополнительной информацией
SELECT 
    status,
    COUNT(*) as total_todos,
    MIN(created_at) as first_created,
    MAX(created_at) as last_created,
    AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at))/86400) as avg_days_old
FROM todos
GROUP BY status
ORDER BY status;

-- Процентное соотношение задач по статусам
WITH status_counts AS (
    SELECT 
        status,
        COUNT(*) as count
    FROM todos
    GROUP BY status
),
total_count AS (
    SELECT COUNT(*) as total FROM todos
)
SELECT 
    sc.status,
    sc.count,
    ROUND((sc.count::DECIMAL / tc.total) * 100, 2) as percentage
FROM status_counts sc
CROSS JOIN total_count tc
ORDER BY sc.count DESC;

3. COUNT TODOS PER USER:

-- Количество задач на каждого пользователя
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(t.id) as total_todos
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_todos DESC;

-- Детальная статистика по пользователям
SELECT 
    u.name,
    u.email,
    COUNT(t.id) as total_todos,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_todos,
    SUM(CASE WHEN t.status = 'active' THEN 1 ELSE 0 END) as active_todos,
    SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_todos,
    ROUND(AVG(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) * 100, 2) as completion_rate
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_todos DESC;

-- Пользователи с количеством задач (только те, у кого есть задачи)
SELECT 
    u.name,
    u.email,
    COUNT(*) as todo_count,
    MIN(t.created_at) as first_todo_date,
    MAX(t.created_at) as last_todo_date
FROM users u
INNER JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email
HAVING COUNT(*) > 0
ORDER BY todo_count DESC;

4. FIND USERS WITH NO TODOS:

-- Пользователи без задач (LEFT JOIN с проверкой NULL)
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at as user_created
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
WHERE t.id IS NULL
ORDER BY u.created_at DESC;

-- Альтернативный вариант с NOT EXISTS
SELECT 
    u.id,
    u.name,
    u.email
FROM users u
WHERE NOT EXISTS (
    SELECT 1 
    FROM todos t 
    WHERE t.user_id = u.id
)
ORDER BY u.name;

-- Количество пользователей без задач
SELECT 
    COUNT(*) as users_without_todos
FROM users u
WHERE NOT EXISTS (
    SELECT 1 
    FROM todos t 
    WHERE t.user_id = u.id
);

5. ADDITIONAL AGGREGATION QUERIES:

-- Среднее количество задач на пользователя
SELECT 
    ROUND(AVG(todo_count), 2) as avg_todos_per_user
FROM (
    SELECT 
        u.id,
        COUNT(t.id) as todo_count
    FROM users u
    LEFT JOIN todos t ON u.id = t.user_id
    GROUP BY u.id
) as user_todo_counts;

-- Пользователи с максимальным количеством задач
WITH user_todo_stats AS (
    SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(t.id) as todo_count
    FROM users u
    LEFT JOIN todos t ON u.id = t.user_id
    GROUP BY u.id, u.name, u.email
)
SELECT *
FROM user_todo_stats
WHERE todo_count = (SELECT MAX(todo_count) FROM user_todo_stats);

-- Распределение задач по дням создания
SELECT 
    DATE(created_at) as created_date,
    COUNT(*) as todos_created,
    STRING_AGG(title, ', ') as todo_titles
FROM todos
GROUP BY DATE(created_at)
ORDER BY created_date DESC;

6. DATA VERIFICATION:

-- Общая статистика
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM todos) as total_todos,
    (SELECT COUNT(DISTINCT user_id) FROM todos) as users_with_todos,
    (SELECT COUNT(*) FROM users WHERE NOT EXISTS (SELECT 1 FROM todos WHERE todos.user_id = users.id)) as users_without_todos;
