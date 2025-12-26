// todo-crud.ts
import { Todo } from './types';

export const addTodo = (state: Todo[], todo: Todo): Todo[] => {
    return [...state, todo];
};

export const updateTodo = (
    state: Todo[], 
    id: number, 
    update: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo[] => {
    const index = state.findIndex(t => t.id === id);
    
    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }
    
    const updatedTodo = {
        ...state[index],
        ...update
    };
    
    return [
        ...state.slice(0, index),
        updatedTodo,
        ...state.slice(index + 1)
    ];
};

export const removeTodo = (state: Todo[], id: number): Todo[] => {
    const index = state.findIndex(t => t.id === id);
    
    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }
    
    return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
    ];
};

export const getTodo = (state: Todo[], id: number): Todo | undefined => {
    return state.find(t => t.id === id);
};