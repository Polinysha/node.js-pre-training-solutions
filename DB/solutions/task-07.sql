=== TASK 07: ORM SETUP AND IMPLEMENTATION ===

1. ORM SELECTION AND INSTALLATION:

Выбран Sequelize как наиболее популярный ORM для Node.js.

Установленные пакеты:
npm install sequelize pg pg-hstore
npm install --save-dev sequelize-cli

2. PROJECT STRUCTURE:

node.js-pre-training-solutions/
├── config/
│   └── database.js          # Конфигурация БД
├── models/
│   ├── user.js              # Модель User
│   └── todo.js              # Модель Todo
├── migrations/
│   ├── XXXXXXXXXXXXXX-create-user.js
│   └── XXXXXXXXXXXXXX-create-todo.js
├── seeders/
│   └── XXXXXXXXXXXXXX-demo-users.js
├── .sequelizerc             # Конфигурация Sequelize CLI
├── .env                     # Переменные окружения
└── orm-test.js              # Тестовый скрипт

3. MIGRATION FILES:

-- users migration: Определяет таблицу Users с полями:
   id, username, email, createdAt, updatedAt

-- todos migration: Определяет таблицу Todos с полями:
   id, title, description, status, userId, createdAt, updatedAt
   Индексы: userId, status, userId+status
   Foreign key: userId → Users.id

4. MODEL DEFINITIONS:

-- User model (models/user.js):
   Поля: username, email
   Связь: User.hasMany(Todo)
   Валидации: notEmpty, isEmail

-- Todo model (models/todo.js):
   Поля: title, description, status, userId
   Связь: Todo.belongsTo(User)
   Валидации: notEmpty, isIn(['active','completed','pending'])

5. SEED DATA:

-- Создано 3 пользователя:
   1. john_doe (john@example.com)
   2. jane_smith (jane@example.com)  
   3. alex_wong (alex@example.com)

-- Создано 9 задач (по 3 на каждого пользователя):
   Разные статусы: active, completed, pending

6. COMMANDS EXECUTED:

# Инициализация
npx sequelize-cli init

# Создание моделей
npx sequelize-cli model:generate --name User --attributes username:string,email:string
npx sequelize-cli model:generate --name Todo --attributes title:string,description:text,status:string,userId:integer

# Миграции
npx sequelize-cli db:migrate

# Создание сидов
npx sequelize-cli seed:generate --name demo-users
npx sequelize-cli db:seed:all

7. TEST RESULTS:

Все миграции выполнены успешно.
Сид данные добавлены в БД.
ORM тесты выполнены:
- Подключение к БД .
- Получение данных с JOIN .
- CRUD операции .
- Агрегация данных .

8. ISSUES AND SOLUTIONS:

1. Проблема: Неправильные имена таблиц в PostgreSQL (регистр)
   Решение: Явно указать tableName в моделях

2. Проблема: Отсутствие каскадного удаления
   Решение: Добавить onDelete: 'CASCADE' в миграции

3. Проблема: Валидация данных
   Решение: Добавить валидаторы в модели

9. GIT COMMIT:

Используемые файлы добавлены в репозиторий:
- Все конфигурационные файлы Sequelize
- Модели и миграции
- Seed файлы
- Тестовый скрипт

Commit hash: [ВСТАВЬТЕ ХЭШ КОММИТА ПОСЛЕ PUSH]

10. VERIFICATION:

-- Проверка таблиц в БД:
docker exec todo-postgres psql -U postgres -d todo_app -c "\dt"

-- Проверка данных:
docker exec todo-postgres psql -U postgres -d todo_app -c "SELECT * FROM \"Users\" LIMIT 3;"
docker exec todo-postgres psql -U postgres -d todo_app -c "SELECT * FROM \"Todos\" LIMIT 5;"

-- Проверка индексов:
docker exec todo-postgres psql -U postgres -d todo_app -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename IN ('Users', 'Todos') ORDER BY tablename, indexname;"
