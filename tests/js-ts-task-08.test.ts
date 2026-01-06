import { TodoApi } from '../JS-TS/solutions/todo-api';
import { TodoService } from '../JS-TS/solutions/todo-service';

describe('Task 08: TodoService', () => {
  jest.setTimeout(10000);

  it('create should add todo', async () => {
    const service = new TodoService(new TodoApi());
    const created = await service.create('Service Item');
    expect(created.title).toBe('Service Item');
  });

  it('toggleStatus should change status', async () => {
    const service = new TodoService(new TodoApi());
    
    const newTodo = await service.create('toggle-test-task');
    const todoId = newTodo.id;
    
    const toggled = await service.toggleStatus(todoId);
    
    expect(toggled.status).not.toBe(newTodo.status);
  });

  it('search should be case-insensitive', async () => {
    const service = new TodoService(new TodoApi());
    await service.create('Service Item');
    const list = await service.search('SERVICE');
    expect(list.length).toBeGreaterThan(0);
  });
});
