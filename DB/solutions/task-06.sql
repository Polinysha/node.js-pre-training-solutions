=== TASK 06: SQL INDEXES AND QUERY OPTIMIZATION ===

1. DATABASE CONNECTION:

docker exec -it todo-postgres psql -U postgres -d todo_app

2. CURRENT INDEXES ANALYSIS:

SELECT schemaname, tablename, indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('todos', 'users') 
ORDER BY tablename, indexname;

3. CREATE INDEX ON STATUS COLUMN:

CREATE INDEX idx_todos_status ON todos(status);

4. ADDITIONAL USEFUL INDEXES:

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_todos_user_status ON todos(user_id, status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_todos_title ON todos(title);

5. ANALYZE QUERY PERFORMANCE:

EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'active';

EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'completed' ORDER BY created_at DESC;

EXPLAIN ANALYZE SELECT u.name, COUNT(t.id) 
FROM users u 
JOIN todos t ON u.id = t.user_id 
WHERE t.status = 'active' 
GROUP BY u.id, u.name;

EXPLAIN ANALYZE SELECT * FROM todos WHERE user_id = 1 AND status = 'pending';

6. COMPARISON QUERIES (BEFORE/AFTER INDEX):

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM todos 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 10;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.name, t.title, t.status, t.created_at 
FROM users u 
JOIN todos t ON u.id = t.user_id 
WHERE t.status = 'completed' 
AND t.created_at > CURRENT_DATE - INTERVAL '7 days';

EXPLAIN (ANALYZE, BUFFERS) 
SELECT status, COUNT(*) 
FROM todos 
WHERE created_at > CURRENT_DATE - INTERVAL '30 days' 
GROUP BY status;

7. INDEX MAINTENANCE AND STATISTICS:

ANALYZE todos;
ANALYZE users;

SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_autovacuum 
FROM pg_stat_user_tables 
WHERE relname IN ('todos', 'users');

SELECT indexrelname, idx_scan, idx_tup_read, idx_tup_fetch 
FROM pg_stat_user_indexes 
WHERE relname = 'todos' 
ORDER BY idx_scan DESC;

8. QUERY OPTIMIZATION TECHNIQUES:

EXPLAIN ANALYZE 
SELECT * 
FROM todos 
WHERE LOWER(title) LIKE '%task%' 
AND status = 'active';

CREATE INDEX idx_todos_title_lower ON todos(LOWER(title));

EXPLAIN ANALYZE 
SELECT * 
FROM todos 
WHERE LOWER(title) LIKE '%task%' 
AND status = 'active';

9. INDEX SIZE INFORMATION:

SELECT 
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_indexes 
WHERE tablename = 'todos' 
ORDER BY pg_relation_size(indexname::regclass) DESC;

10. DROP UNUSED INDEXES (IF NEEDED):

SELECT 
    indexname,
    idx_scan
FROM pg_stat_user_indexes 
WHERE relname = 'todos' 
AND idx_scan = 0;

DROP INDEX IF EXISTS idx_unused;
