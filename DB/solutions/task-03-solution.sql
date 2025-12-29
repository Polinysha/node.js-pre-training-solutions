=== TASK 03: SQL FILTER/SORT SOLUTION ===

1. Фильтрация по статусу:
SELECT * FROM todos 
WHERE is_completed = false 
ORDER BY due_date, priority;

2. Фильтрация по приоритету:
SELECT * FROM todos 
WHERE priority BETWEEN 1 AND 2 
ORDER BY priority, due_date;

3. Фильтрация по дате:
SELECT * FROM todos 
WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
AND is_completed = false;

4. Поиск по описанию:
SELECT * FROM todos 
WHERE description ILIKE '%report%';

SQL файл: sql/03-filter-sort.sql
