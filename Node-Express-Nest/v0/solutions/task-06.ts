export class TodosService {
  private todos = [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Learn NestJS', completed: true }
  ];

  getTodos() {
    return this.todos;
  }

  addTodo(title: string) {
    const newTodo = {
      id: this.todos.length + 1,
      title,
      completed: false
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  markCompleted(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = true;
      return todo;
    }
    return null;
  }
}
