# Docker & Git Cheatsheet
# Essential commands from all tasks

## GIT COMMANDS

### Basic Operations
git init                            # Initialize new repository
git config user.name "Name"         # Configure user name
git config user.email "email"       # Configure user email
git status                          # Check repository status
git add <file>                      # Stage specific file
git add .                          # Stage all changes
git commit -m "message"             # Commit with message
git log --oneline                   # Compact commit history
git log --graph --all               # Visualize branch history

### Branching
git branch                          # List branches
git branch <name>                   # Create new branch
git checkout <branch>               # Switch to branch
git checkout -b <branch>            # Create and switch to branch
git merge <branch>                  # Merge branch into current
git branch -d <branch>              # Delete branch (safe)
git branch -D <branch>              # Delete branch (force)

### Advanced
git rebase -i HEAD~5                # Interactive rebase last 5 commits
git rebase main                     # Rebase current branch onto main
git push --force-with-lease         # Safe force push
git stash                           # Save uncommitted changes
git stash pop                       # Restore stashed changes
git cherry-pick <commit>            # Apply specific commit

### Conflict Resolution
git merge --abort                   # Abort merge
git status                          # View conflicted files
git diff --name-only --diff-filter=U # List conflicted files
git checkout --ours <file>          # Accept current branch version
git checkout --theirs <file>        # Accept other branch version
git add <file>                      # Mark conflict as resolved

### Remote Operations
git remote -v                       # List remotes
git remote add origin <url>         # Add remote
git push -u origin main             # Push and set upstream
git fetch origin                    # Fetch remote changes
git pull origin main                # Fetch and merge
git push origin --delete <branch>   # Delete remote branch

## DOCKER COMMANDS

### Image Management
docker images                       # List images
docker pull <image>:<tag>           # Pull image
docker build -t <name> .            # Build image
docker image inspect <image>        # Inspect image
docker image prune                  # Remove unused images
docker image rm <image>             # Remove image

### Container Lifecycle
docker run -d -p 80:80 <image>      # Run container in background
docker run -it <image> sh           # Run interactive shell
docker ps                           # List running containers
docker ps -a                        # List all containers
docker start <container>            # Start stopped container
docker stop <container>             # Stop container
docker restart <container>          # Restart container
docker rm <container>               # Remove container
docker container prune              # Remove stopped containers

### Monitoring & Logs
docker logs <container>             # View container logs
docker logs -f <container>          # Follow logs
docker stats                        # Live container stats
docker stats --no-stream            # One-time stats
docker top <container>              # View running processes
docker inspect <container>          # Detailed container info

### Exec & Copy
docker exec <container> <cmd>       # Execute command in container
docker exec -it <container> sh      # Interactive shell in container
docker cp <container>:<path> <dest> # Copy from container
docker cp <src> <container>:<path>  # Copy to container

### System Management
docker system df                    # Disk usage
docker system prune                 # Clean unused data
docker system prune -a --volumes    # Clean everything
docker version                      # Docker version
docker info                         # System-wide info

### Networks
docker network ls                   # List networks
docker network create <name>        # Create network
docker network inspect <name>       # Inspect network
docker network connect <net> <cont> # Connect container to network
docker network disconnect <net> <cont> # Disconnect container
docker network rm <name>            # Remove network

### Volumes
docker volume ls                    # List volumes
docker volume create <name>         # Create volume
docker volume inspect <name>        # Inspect volume
docker volume rm <name>             # Remove volume
docker volume prune                 # Remove unused volumes

### Docker Compose
docker-compose up -d                # Start services in background
docker-compose down                 # Stop and remove services
docker-compose ps                   # List services
docker-compose logs                 # View logs
docker-compose logs -f              # Follow logs
docker-compose exec <service> <cmd> # Execute in service
docker-compose build                # Build images
docker-compose pull                 # Pull images
docker-compose config               # Validate compose file

## DOCKERFILE EXAMPLES

### Basic Node.js Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

### Multi-stage Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]

### Python Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]

## BEST PRACTICES

### Git
1. Commit часто, небольшими порциями
2. Используйте осмысленные сообщения коммитов
3. Ветки для новых функций и исправлений
4. Регулярно синхронизируйтесь с удаленным репозиторием
5. Используйте .gitignore для ненужных файлов

### Docker
1. Используйте официальные образы
2. Минимизируйте количество слоев
3. Используйте .dockerignore
4. Указывайте конкретные версии тегов
5. Используйте multi-stage builds для production
6. Настраивайте health checks
7. Используйте volumes для данных

### Security
1. Не храните секреты в образах
2. Используйте сканирование уязвимостей
3. Минимальные привилегии для контейнеров
4. Регулярно обновляйте базовые образы
5. Используйте пользователей не root в контейнерах

## TROUBLESHOOTING

### Git Issues
# Отмена последнего коммита
git reset --soft HEAD~1

# Изменение последнего коммита
git commit --amend

# Восстановление удаленного файла
git checkout -- <file>

# Поиск в истории
git log --grep="search"

### Docker Issues
# Просмотр занимаемого места
docker system df

# Очистка всего
docker system prune -a --volumes

# Просмотр логов при сборке
docker build --no-cache .

# Отладка запуска контейнера
docker run -it --entrypoint=sh <image>

# Проверка сети
docker network inspect bridge

---

*Generated from Docker-Git training solutions*
*Last updated: $(Get-Date -Format 'yyyy-MM-dd')*
