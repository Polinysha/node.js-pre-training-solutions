//5
import { Todo, TodoStatus } from './types';

export function bulkAdd(todos: Todo[], newTodos: Todo[]): Todo[] {
    return [...todos, ...newTodos];
}

export function bulkUpdateStatus(todos: Todo[], ids: number[], status: TodoStatus): Todo[] {
    return todos.map(todo =>
        ids.includes(todo.id) ? { ...todo, status } : todo
    );
}

export function bulkRemove(todos: Todo[], ids: number[]): Todo[] {
    return todos.filter(todo => !ids.includes(todo.id));
}

export function toggleAll(todos: Todo[], completed: boolean): Todo[] {
    return todos.map(todo => ({
        ...todo,
        status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING
    }));
}

export function clearCompleted(todos: Todo[]): Todo[] {
    return todos.filter(todo => todo.status !== TodoStatus.COMPLETED);
}

export function countByStatus(todos: Todo[], status: TodoStatus): number {
    return todos.filter(todo => todo.status === status).length;
}
