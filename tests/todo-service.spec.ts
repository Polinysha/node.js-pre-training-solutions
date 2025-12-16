import { TodoService } from '../solutions/todo-service';
import { TodoStatus } from '../solutions/types';

describe('TodoService', () => {
    let service: TodoService;

    beforeEach(() => {
        service = new TodoService();
    });

    describe('create', () => {
        it('should successfully create a todo', async () => {
            const title = 'Test Todo';
            const description = 'Test Description';
            
            const result = await service.create(title, description);

            expect(result.title).toBe(title);
            expect(result.description).toBe(description);
            expect(result.status).toBe(TodoStatus.PENDING);
            expect(result.id).toBeDefined();
            expect(result.createdAt).toBeInstanceOf(Date);
        });

        it('should create todo with empty description when not provided', async () => {
            const result = await service.create('Test Todo');

            expect(result.description).toBe('');
        });
    });

    describe('toggleStatus', () => {
        it('should toggle status from PENDING to COMPLETED', async () => {
            const todo = await service.create('Test Todo');

            const toggled = await service.toggleStatus(todo.id);

            expect(toggled.status).toBe(TodoStatus.COMPLETED);
        });

        it('should toggle status from COMPLETED to PENDING', async () => {
            const todo = await service.create('Test Todo');

            // First toggle to COMPLETED
            await service.toggleStatus(todo.id);
            // Second toggle back to PENDING
            const result = await service.toggleStatus(todo.id);

            expect(result.status).toBe(TodoStatus.PENDING);
        });

        it('should throw error when toggling non-existing id', async () => {
            const nonExistingId = 999;

            await expect(service.toggleStatus(nonExistingId))
                .rejects.toThrow(`Todo with id ${nonExistingId} not found`);
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await service.create('Learn TypeScript', 'Study types');
            await service.create('Build React App', 'Create components');
            await service.create('TypeScript Advanced', 'Generics and decorators');
        });

        it('should return matching items by title', async () => {
            const results = await service.search('typescript');

            expect(results).toHaveLength(2);
            expect(results[0].title).toContain('TypeScript');
            expect(results[1].title).toContain('TypeScript');
        });

        it('should return matching items by description', async () => {
            const results = await service.search('components');

            expect(results).toHaveLength(1);
            expect(results[0].description).toContain('components');
        });

        it('should be case insensitive', async () => {
            const lowerResults = await service.search('typescript');
            const upperResults = await service.search('TYPESCRIPT');

            expect(lowerResults).toHaveLength(2);
            expect(upperResults).toHaveLength(2);
        });

        it('should return empty array when no matches found', async () => {
            const results = await service.search('nonexistent');

            expect(results).toHaveLength(0);
        });
    });

    describe('getAll', () => {
        it('should return all created todos', async () => {
            await service.create('Todo 1');
            await service.create('Todo 2');

            const results = await service.getAll();

            expect(results).toHaveLength(2);
            expect(results[0].title).toBe('Todo 1');
            expect(results[1].title).toBe('Todo 2');
        });

        it('should return empty array when no todos', async () => {
            const results = await service.getAll();

            expect(results).toHaveLength(0);
        });
    });
});
