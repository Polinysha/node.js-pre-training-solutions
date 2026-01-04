=== TASK 09: SQL TRIGGERS AND AUDIT LOG ===

1. AUDIT_LOG TABLE CREATION:

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);

2. PLPGSQL FUNCTION FOR TRIGGER:

CREATE OR REPLACE FUNCTION log_todo_changes()
RETURNS TRIGGER AS \$\$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (todo_id, action, new_data, changed_at)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (todo_id, action, old_data, new_data, changed_at)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (todo_id, action, old_data, changed_at)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
\$\$ LANGUAGE plpgsql;

3. TRIGGERS CREATION:

-- For INSERT operations
CREATE TRIGGER todo_insert_trigger
AFTER INSERT ON "Todos"
FOR EACH ROW
EXECUTE FUNCTION log_todo_changes();

-- For UPDATE operations  
CREATE TRIGGER todo_update_trigger
AFTER UPDATE ON "Todos"
FOR EACH ROW
EXECUTE FUNCTION log_todo_changes();

-- For DELETE operations
CREATE TRIGGER todo_delete_trigger
AFTER DELETE ON "Todos"
FOR EACH ROW
EXECUTE FUNCTION log_todo_changes();

4. TESTING PROCEDURE:

4.1 Test INSERT trigger:
INSERT INTO "Todos" (title, description, status, "userId") 
VALUES ('Audit Test Task', 'Testing audit triggers', 'active', 1);

4.2 Test UPDATE trigger:
UPDATE "Todos" 
SET status = 'completed', description = 'Audit test completed' 
WHERE title = 'Audit Test Task';

4.3 Test DELETE trigger:
DELETE FROM "Todos" WHERE title = 'Audit Test Task';

5. VERIFICATION QUERIES:

-- Check audit log entries
SELECT * FROM audit_log ORDER BY changed_at DESC LIMIT 5;

-- Check specific action types
SELECT action, COUNT(*) as count 
FROM audit_log 
GROUP BY action 
ORDER BY count DESC;

-- View detailed audit trail with todo information
SELECT 
    al.id as audit_id,
    al.action,
    al.changed_at,
    al.old_data->>'title' as old_title,
    al.new_data->>'title' as new_title,
    al.old_data->>'status' as old_status,
    al.new_data->>'status' as new_status
FROM audit_log al
ORDER BY al.changed_at DESC
LIMIT 10;

6. ADDITIONAL FEATURES IMPLEMENTED:

- JSONB storage for complete record snapshots (old_data, new_data)
- Support for all three operations: INSERT, UPDATE, DELETE
- CHECK constraint on action field for data integrity
- Timestamp with default value for tracking change time
- Optional changed_by field for user tracking

7. EXECUTION COMMANDS:

All SQL commands executed via:
docker exec -i todo-postgres psql -U postgres -d todo_app

8. TEST RESULTS:

Trigger testing completed successfully:
- INSERT operation: 1 audit record created
- UPDATE operation: 1 audit record created with old/new data
- DELETE operation: 1 audit record created with old data

All triggers fire correctly and store complete record history.

9. AUDIT LOG MAINTENANCE:

-- Cleanup old audit records (older than 1 year)
DELETE FROM audit_log 
WHERE changed_at < CURRENT_DATE - INTERVAL '1 year';

-- Create index for performance
CREATE INDEX idx_audit_log_todo_id ON audit_log(todo_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);

10. GIT INTEGRATION:

Files to commit:
- DB/solutions/task-09.sql (this documentation)
- SQL trigger implementation executed directly on database

Commit with message: "Task 09: Implement audit log triggers"

11. DATABASE VERIFICATION:

Current audit log status:
SELECT COUNT(*) as total_audit_records FROM audit_log;
SELECT action, COUNT(*) FROM audit_log GROUP BY action;
