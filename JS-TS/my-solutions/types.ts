enum TodoStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    readonly createdAt: Date;
}

type NewTodo = Omit<Todo, 'id' | 'createdAt'> & {
    status?: TodoStatus;
};

export { TodoStatus, Todo, NewTodo };
