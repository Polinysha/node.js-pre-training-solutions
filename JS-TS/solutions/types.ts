//1
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

// Status должен быть опциональным для NewTodo
type NewTodo = {
    title: string;
    description?: string;
    status?: TodoStatus;
};

export { TodoStatus, Todo, NewTodo };
