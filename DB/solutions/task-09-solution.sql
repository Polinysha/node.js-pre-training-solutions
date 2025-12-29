=== TASK 09: SQL TRIGGERS/AUDIT SOLUTION ===

1. Таблица аудита:
CREATE TABLE todo_audit_log (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. Триггерная функция:
CREATE OR REPLACE FUNCTION log_todo_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO todo_audit_log (todo_id, action)
        VALUES (OLD.id, 'DELETE');
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO todo_audit_log (todo_id, action)
        VALUES (OLD.id, 'UPDATE');
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO todo_audit_log (todo_id, action)
        VALUES (NEW.id, 'INSERT');
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

3. Триггер:
CREATE TRIGGER todo_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_changes();

SQL файл: sql/09-triggers.sql
