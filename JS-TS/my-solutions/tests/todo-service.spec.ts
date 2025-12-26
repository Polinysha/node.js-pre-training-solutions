import { TodoService } from '../todo-service';
import { TodoApi } from '../todo-api';
import { TodoStatus } from '../types';

const mockTodoApi = {
  getAll: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
};

describe('TodoService', () => {
  let service: TodoService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = new TodoService(mockTodoApi as any);
  });

  // Тесты для create
  test('create should add todo with valid title', async () => {
    const mockTodo = { 
      id: 1, 
      title: 'Test', 
      status: TodoStatus.PENDING,
      createdAt: new Date()
    };
    mockTodoApi.add.mockResolvedValue(mockTodo);

    const result = await service.create('Test');
    
    expect(mockTodoApi.add).toHaveBeenCalledWith({
      title: 'Test',
      description: undefined,
      status: TodoStatus.PENDING
    });
    expect(result).toEqual(mockTodo);
  });

  test('create should add todo with description', async () => {
    const mockTodo = { 
      id: 1, 
      title: 'Test', 
      description: 'Test description',
      status: TodoStatus.PENDING,
      createdAt: new Date()
    };
    mockTodoApi.add.mockResolvedValue(mockTodo);

    const result = await service.create('Test', 'Test description');
    
    expect(mockTodoApi.add).toHaveBeenCalledWith({
      title: 'Test',
      description: 'Test description',
      status: TodoStatus.PENDING
    });
    expect(result).toEqual(mockTodo);
  });

  test('create should trim title and description', async () => {
    const mockTodo = { 
      id: 1, 
      title: 'Test', 
      description: 'Description',
      status: TodoStatus.PENDING,
      createdAt: new Date()
    };
    mockTodoApi.add.mockResolvedValue(mockTodo);

    await service.create('  Test  ', '  Description  ');
    
    expect(mockTodoApi.add).toHaveBeenCalledWith({
      title: 'Test',
      description: 'Description',
      status: TodoStatus.PENDING
    });
  });

  test('create should throw error for empty title', async () => {
    await expect(service.create('')).rejects.toThrow('Title cannot be empty');
  });

  test('create should throw error for whitespace-only title', async () => {
    await expect(service.create('   ')).rejects.toThrow('Title cannot be empty');
  });

  test('create should throw error for long title', async () => {
    const longTitle = 'a'.repeat(101);
    await expect(service.create(longTitle)).rejects.toThrow('Title cannot exceed 100 characters');
  });

  test('create should throw error for long description', async () => {
    const longDescription = 'a'.repeat(1001);
    await expect(service.create('Test', longDescription)).rejects.toThrow('Description cannot exceed 1000 characters');
  });

  // Тесты для toggleStatus
  test('toggleStatus should change status from PENDING to COMPLETED', async () => {
    const todo = { 
      id: 1, 
      title: 'Test', 
      status: TodoStatus.PENDING,
      createdAt: new Date()
    };
    
    mockTodoApi.getAll.mockResolvedValue([todo]);
    mockTodoApi.update.mockResolvedValue({ ...todo, status: TodoStatus.COMPLETED });

    const result = await service.toggleStatus(1);

    expect(mockTodoApi.update).toHaveBeenCalledWith(1, { status: TodoStatus.COMPLETED });
    expect(result.status).toBe(TodoStatus.COMPLETED);
  });

  test('toggleStatus should change status from COMPLETED to PENDING', async () => {
    const todo = { 
      id: 1, 
      title: 'Test', 
      status: TodoStatus.COMPLETED,
      createdAt: new Date()
    };
    
    mockTodoApi.getAll.mockResolvedValue([todo]);
    mockTodoApi.update.mockResolvedValue({ ...todo, status: TodoStatus.PENDING });

    const result = await service.toggleStatus(1);

    expect(mockTodoApi.update).toHaveBeenCalledWith(1, { status: TodoStatus.PENDING });
    expect(result.status).toBe(TodoStatus.PENDING);
  });

  test('toggleStatus should throw error for invalid ID', async () => {
    await expect(service.toggleStatus(0)).rejects.toThrow('Invalid todo ID');
    await expect(service.toggleStatus(-1)).rejects.toThrow('Invalid todo ID');
  });

  test('toggleStatus should throw error when todo not found', async () => {
    mockTodoApi.getAll.mockResolvedValue([]);

    await expect(service.toggleStatus(999)).rejects.toThrow('Todo with ID 999 not found');
  });

  // Тесты для search
  test('search should find todos by title', async () => {
    const todos = [
      { id: 1, title: 'Buy groceries', description: 'Milk and eggs' },
      { id: 2, title: 'Clean house', description: 'Living room and kitchen' },
      { id: 3, title: 'Read TypeScript book', description: 'Advanced patterns' }
    ] as any[];
    
    mockTodoApi.getAll.mockResolvedValue(todos);

    const result = await service.search('groceries');
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy groceries');
  });

  test('search should find todos by description', async () => {
    const todos = [
      { id: 1, title: 'Task 1', description: 'Clean kitchen' },
      { id: 2, title: 'Task 2', description: 'Clean bathroom' },
      { id: 3, title: 'Task 3', description: 'Read book' }
    ] as any[];
    
    mockTodoApi.getAll.mockResolvedValue(todos);

    const result = await service.search('clean');
    
    expect(result).toHaveLength(2);
    expect(result[0].description).toBe('Clean kitchen');
    expect(result[1].description).toBe('Clean bathroom');
  });

  test('search should be case-insensitive', async () => {
    const todos = [
      { id: 1, title: 'TypeScript Learning', description: 'Study generics' }
    ] as any[];
    
    mockTodoApi.getAll.mockResolvedValue(todos);

    const result = await service.search('typescript');
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TypeScript Learning');
  });

  test('search should throw error for empty keyword', async () => {
    await expect(service.search('')).rejects.toThrow('Search keyword cannot be empty');
  });

  test('search should throw error for whitespace-only keyword', async () => {
    await expect(service.search('   ')).rejects.toThrow('Search keyword cannot be empty');
  });

  test('search should trim keyword', async () => {
    const todos = [
      { id: 1, title: 'Test', description: 'Description' }
    ] as any[];
    
    mockTodoApi.getAll.mockResolvedValue(todos);

    const result = await service.search('  test  ');
    
    expect(result).toHaveLength(1);
  });

  test('search should return empty array when no matches found', async () => {
    const todos = [
      { id: 1, title: 'Task 1', description: 'Description 1' }
    ] as any[];
    
    mockTodoApi.getAll.mockResolvedValue(todos);

    const result = await service.search('nonexistent');
    
    expect(result).toHaveLength(0);
  });

  test('search should handle todos without description', async () => {
    const todos = [
      { id: 1, title: 'Task without description' }
    ] as any[];
    
    mockTodoApi.getAll.mockResolvedValue(todos);

    const result = await service.search('task');
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Task without description');
  });
});
