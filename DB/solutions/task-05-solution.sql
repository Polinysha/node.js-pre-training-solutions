=== TASK 05: SQL AGGREGATION SOLUTION ===

1. Группировка по статусу:
SELECT 
    CASE 
        WHEN is_completed THEN 'Completed'
        ELSE 'Pending'
    END as status,
    COUNT(*) as todo_count
FROM todos 
GROUP BY is_completed;

2. Средний приоритет по пользователю:
SELECT 
    u.username,
    COUNT(t.id) as todo_count,
    AVG(t.priority) as avg_priority
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.username;

3. Статистика по приоритетам:
SELECT 
    priority,
    COUNT(*) as count
FROM todos 
WHERE is_completed = false
GROUP BY priority;

SQL файл: sql/05-aggregation.sql
