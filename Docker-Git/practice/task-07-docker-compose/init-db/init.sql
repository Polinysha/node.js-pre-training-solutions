-- init.sql - Database initialization script
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) VALUES
('john_doe', 'john@example.com'),
('jane_smith', 'jane@example.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO items (name, description, price) VALUES
('Laptop', 'High-performance laptop', 1299.99),
('Mouse', 'Wireless mouse', 29.99),
('Keyboard', 'Mechanical keyboard', 89.99)
ON CONFLICT (id) DO NOTHING;

-- Create read-only user for pgAdmin
CREATE USER readonly_user WITH PASSWORD 'readonly123';
GRANT CONNECT ON DATABASE appdb TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
