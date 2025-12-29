=== TASK 04: SQL RELATIONSHIPS SOLUTION ===

1. Добавление внешнего ключа:
ALTER TABLE todos ADD COLUMN user_id INTEGER;

ALTER TABLE todos 
ADD CONSTRAINT fk_todos_user 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE;

2. Назначение пользователей:
UPDATE todos SET user_id = 1 WHERE id IN (1, 3, 5);
UPDATE todos SET user_id = 2 WHERE id IN (2, 4);

3. JOIN запрос:
SELECT t.id, t.title, u.username, t.is_completed
FROM todos t
LEFT JOIN users u ON t.user_id = u.id;

SQL файл: sql/04-relationships.sql
