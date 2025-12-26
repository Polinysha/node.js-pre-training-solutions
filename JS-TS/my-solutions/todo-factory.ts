import { Todo, NewTodo, TodoStatus } from './types';

let idCounter = 1;

export const createTodo = (todo: NewTodo): Todo => {
    const newTodo: Todo = {
        id: idCounter++,
        title: todo.title,
        description: todo.description,
        status: todo.status || TodoStatus.PENDING,
        createdAt: new Date()
    };
    
    return newTodo;
};
