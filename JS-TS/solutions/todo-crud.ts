//4
import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
    return [...state, todo];
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {
    const todoExists = state.some(todo => todo.id === id);
    if (!todoExists) {
        throw new Error(`Todo with id ${id} not found`);
    }
    
    return state.map(todo =>
        todo.id === id ? { ...todo, ...update } : todo
    );
}

export function removeTodo(state: Todo[], id: number): Todo[] {
    const todoExists = state.some(todo => todo.id === id);
    if (!todoExists) {
        throw new Error(`Todo with id ${id} not found`);
    }
    
    return state.filter(todo => todo.id !== id);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
    return state.find(todo => todo.id === id);
}
