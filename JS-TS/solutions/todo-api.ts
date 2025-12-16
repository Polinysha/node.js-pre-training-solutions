import { Todo, NewTodo, TodoStatus } from './types';

let todos: Todo[] = [];
let nextId = 1;

export async function createTodo(todoData: NewTodo): Promise<Todo> {
    const todo: Todo = {
        id: nextId++,
        title: todoData.title,
        description: todoData.description,
        status: todoData.status || TodoStatus.PENDING,
        createdAt: new Date()
    };
    
    todos.push(todo);
    return todo;
}

export async function getTodos(): Promise<Todo[]> {
    return [...todos];
}

export async function getTodo(id: number): Promise<Todo | undefined> {
    return todos.find(todo => todo.id === id);
}

export async function updateTodo(id: number, updates: Partial<NewTodo>): Promise<Todo | undefined> {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return undefined;
    
    todos[index] = { ...todos[index], ...updates };
    return todos[index];
}

export async function deleteTodo(id: number): Promise<boolean> {
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    return todos.length < initialLength;
}

// Исправляем класс TodoApi согласно тестам
export class TodoApi {
    private todos: Todo[] = [];
    private nextId = 1;

    async add(todoData: NewTodo): Promise<Todo> {
        const todo: Todo = {
            id: this.nextId++,
            title: todoData.title,
            description: todoData.description,
            status: todoData.status || TodoStatus.PENDING,
            createdAt: new Date()
        };
        
        this.todos.push(todo);
        return todo;
    }

    async getAll(): Promise<Todo[]> {
        return [...this.todos];
    }

    async get(id: number): Promise<Todo | undefined> {
        return this.todos.find(todo => todo.id === id);
    }

    async update(id: number, updates: Partial<NewTodo>): Promise<Todo | undefined> {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) return undefined;
        
        this.todos[index] = { ...this.todos[index], ...updates };
        return this.todos[index];
    }

    async remove(id: number): Promise<boolean> {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter(todo => todo.id !== id);
        return this.todos.length < initialLength;
    }
}
