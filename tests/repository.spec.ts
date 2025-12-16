import { InMemoryRepository } from '../solutions/repository';
import { Todo, TodoStatus } from '../solutions/types';

describe('InMemoryRepository', () => {
    let repository: InMemoryRepository<Todo>;
    
    const sampleTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        status: TodoStatus.PENDING,
        createdAt: new Date()
    };

    beforeEach(() => {
        repository = new InMemoryRepository<Todo>();
    });

    describe('add', () => {
        it('should add entity and return it', () => {
            const result = repository.add(sampleTodo);

            expect(result).toEqual(sampleTodo);
            expect(repository.findAll()).toHaveLength(1);
            expect(repository.findAll()[0]).toEqual(sampleTodo);
        });

        it('should add multiple entities', () => {
            const todo2: Todo = { ...sampleTodo, id: 2, title: 'Todo 2' };

            repository.add(sampleTodo);
            repository.add(todo2);

            expect(repository.findAll()).toHaveLength(2);
        });
    });

    describe('findById', () => {
        beforeEach(() => {
            repository.add(sampleTodo);
            repository.add({ ...sampleTodo, id: 2, title: 'Todo 2' });
        });

        it('should return entity by id', () => {
            const result = repository.findById(1);

            expect(result).toEqual(sampleTodo);
        });

        it('should return undefined for non-existing id', () => {
            const result = repository.findById(999);

            expect(result).toBeUndefined();
        });
    });

    describe('findAll', () => {
        it('should return empty array when no entities', () => {
            const result = repository.findAll();

            expect(result).toEqual([]);
        });

        it('should return all entities', () => {
            repository.add(sampleTodo);
            repository.add({ ...sampleTodo, id: 2 });

            const result = repository.findAll();

            expect(result).toHaveLength(2);
        });

        it('should return copy of entities array', () => {
            repository.add(sampleTodo);
            const result1 = repository.findAll();
            const result2 = repository.findAll();

            expect(result1).not.toBe(result2);
            expect(result1).toEqual(result2);
        });
    });

    describe('update', () => {
        beforeEach(() => {
            repository.add(sampleTodo);
        });

        it('should update existing entity', () => {
            const updates = { title: 'Updated Title', status: TodoStatus.COMPLETED };
            
            const result = repository.update(1, updates);

            expect(result.title).toBe('Updated Title');
            expect(result.status).toBe(TodoStatus.COMPLETED);
            expect(result.description).toBe(sampleTodo.description);
            expect(result.id).toBe(sampleTodo.id);
        });

        it('should throw error when updating non-existing id', () => {
            const updates = { title: 'Updated Title' };

            expect(() => {
                repository.update(999, updates);
            }).toThrow('Entity with id 999 not found');
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            repository.add(sampleTodo);
            repository.add({ ...sampleTodo, id: 2 });
        });

        it('should remove entity by id', () => {
            repository.remove(1);

            expect(repository.findAll()).toHaveLength(1);
            expect(repository.findById(1)).toBeUndefined();
            expect(repository.findById(2)).toBeDefined();
        });

        it('should not throw error when removing non-existing id', () => {
            expect(() => {
                repository.remove(999);
            }).not.toThrow();
        });

        it('should handle removing from empty repository', () => {
            const emptyRepository = new InMemoryRepository<Todo>();
            
            expect(() => {
                emptyRepository.remove(1);
            }).not.toThrow();
        });
    });
});
