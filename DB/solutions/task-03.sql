=== TASK 03: SQL FILTERING AND SORTING ===

1. DATABASE CONNECTION:

docker exec -it todo-postgres psql -U postgres -d todo_app

2. FILTER BY STATUS:

-- Select all active todos
SELECT id, title, status, created_at 
FROM todos 
WHERE status = 'active';

-- Select all completed todos
SELECT id, title, status, created_at 
FROM todos 
WHERE status = 'completed';

-- Select todos with specific statuses
SELECT id, title, status, created_at 
FROM todos 
WHERE status IN ('active', 'pending');

-- Count todos by status
SELECT status, COUNT(*) as total
FROM todos 
GROUP BY status 
ORDER BY total DESC;

3. SORT BY CREATION DATE:

-- Ascending order (oldest first)
SELECT id, title, status, created_at 
FROM todos 
ORDER BY created_at ASC;

-- Descending order (newest first)
SELECT id, title, status, created_at 
FROM todos 
ORDER BY created_at DESC;

-- Sort with limit (latest 5 todos)
SELECT id, title, status, created_at 
FROM todos 
ORDER BY created_at DESC 
LIMIT 5;

4. SEARCH BY KEYWORD:

-- Search in title or description (case-insensitive)
SELECT id, title, description, status 
FROM todos 
WHERE title ILIKE '%встреча%' OR description ILIKE '%встреча%';

-- Search only in title
SELECT id, title, status 
FROM todos 
WHERE title ILIKE '%отчет%';

-- Search with multiple keywords
SELECT id, title, description, status 
FROM todos 
WHERE title ILIKE '%проект%' OR description ILIKE '%проект%';

5. COMBINED FILTERS AND SORTING:

-- Active todos sorted by creation date (newest first)
SELECT id, title, status, created_at 
FROM todos 
WHERE status = 'active' 
ORDER BY created_at DESC;

-- Completed todos containing 'meeting' keyword
SELECT id, title, description, status, created_at 
FROM todos 
WHERE status = 'completed' 
AND (title ILIKE '%meeting%' OR description ILIKE '%meeting%') 
ORDER BY created_at ASC;

-- Todos created in the last 7 days, sorted by status and date
SELECT id, title, status, created_at 
FROM todos 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' 
ORDER BY status, created_at DESC;

6. ADDITIONAL FILTERING TECHNIQUES:

-- Filter by date range
SELECT id, title, status, created_at 
FROM todos 
WHERE created_at BETWEEN '2024-01-08' AND '2024-01-12' 
ORDER BY created_at;

-- Filter by user and status
SELECT t.id, t.title, t.status, u.username, t.created_at 
FROM todos t 
JOIN users u ON t.user_id = u.id 
WHERE t.status = 'active' AND u.username = 'alex' 
ORDER BY t.created_at DESC;

-- Filter todos with description (not empty)
SELECT id, title, status 
FROM todos 
WHERE description IS NOT NULL AND description != '' 
ORDER BY title;
