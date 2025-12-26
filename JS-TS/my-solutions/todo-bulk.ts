// todo-bulk.ts
import { Todo, TodoStatus } from './types';

export const toggleAll = (state: Todo[], completed: boolean): Todo[] => {
    const newStatus = completed ? TodoStatus.COMPLETED : TodoStatus.PENDING;
    
    return state.map(todo => ({
        ...todo,
        status: newStatus
    }));
};

export const clearCompleted = (state: Todo[]): Todo[] => {
    return state.filter(todo => todo.status !== TodoStatus.COMPLETED);
};

export const countByStatus = (state: Todo[], status: TodoStatus): number => {
    return state.reduce((count, todo) => {
        return todo.status === status ? count + 1 : count;
    }, 0);
};