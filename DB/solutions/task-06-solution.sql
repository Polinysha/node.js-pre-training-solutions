=== TASK 06: SQL INDEX/OPTIMIZE SOLUTION ===

1. Создание индексов:
CREATE INDEX idx_todos_user_completed ON todos(user_id, is_completed);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_user_due_priority ON todos(user_id, due_date, priority);

2. Анализ производительности:
EXPLAIN ANALYZE 
SELECT * FROM todos 
WHERE user_id = 1 
AND is_completed = false;

3. Проверка индексов:
SELECT tablename, indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public';

SQL файл: sql/06-indexes.sql
