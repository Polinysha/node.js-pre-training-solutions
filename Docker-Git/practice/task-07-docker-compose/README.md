# Docker Compose Multi-Service Application

This project demonstrates Docker Compose orchestration with:
1. Node.js API (Express)
2. PostgreSQL Database
3. pgAdmin for database management

## Services

### 1. PostgreSQL Database
- Port: 5432
- Database: appdb
- User: postgres
- Password: secretpassword
- Data volume: postgres-data

### 2. Node.js API
- Port: 3000
- Endpoints:
  - GET /health - Health check
  - GET /data - Sample data
  - GET /users - List users from database
  - POST /users - Create new user

### 3. pgAdmin
- Port: 5050
- Email: admin@example.com
- Password: adminpassword
- Access: http://localhost:5050

## How to Run

1. Start all services:
   \\\ash
   docker-compose up -d
   \\\

2. Check running services:
   \\\ash
   docker-compose ps
   \\\

3. View logs:
   \\\ash
   docker-compose logs -f
   \\\

4. Stop services:
   \\\ash
   docker-compose down
   \\\

5. Stop and remove volumes:
   \\\ash
   docker-compose down -v
   \\\

## Testing

1. API Health Check:
   \\\ash
   curl http://localhost:3000/health
   \\\

2. Sample Data:
   \\\ash
   curl http://localhost:3000/data
   \\\

3. Database Users:
   \\\ash
   curl http://localhost:3000/users
   \\\

## Database Connection in pgAdmin

1. Open http://localhost:5050
2. Login with: admin@example.com / adminpassword
3. Add new server:
   - Name: PostgreSQL Server
   - Host: postgres-db-service
   - Port: 5432
   - Username: postgres
   - Password: secretpassword
