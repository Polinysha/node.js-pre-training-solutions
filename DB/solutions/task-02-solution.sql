=== TASK 02: SQL CRUD SOLUTION ===

-- CREATE
INSERT INTO todos (title, description, is_completed, due_date, priority) 
VALUES ('Learn Docker', 'Complete Docker tutorial', false, '2025-01-10', 2);

-- READ
SELECT * FROM todos;
SELECT * FROM todos WHERE id = 1;

-- UPDATE  
UPDATE todos 
SET is_completed = true, updated_at = CURRENT_TIMESTAMP 
WHERE id = 2;

-- DELETE
DELETE FROM todos WHERE id = 5;

SQL файл: sql/02-crud-operations.sql
