import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  create(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.idCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      ...createTodoDto
    };
    
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(t => t.id === id);
    
    if (!todo) {
      throw new NotFoundException(\Todo with ID \ not found\);
    }
    
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const index = this.todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new NotFoundException(\Todo with ID \ not found\);
    }
    
    const updatedTodo = {
      ...this.todos[index],
      ...updateTodoDto,
      updatedAt: new Date()
    };
    
    this.todos[index] = updatedTodo;
    return updatedTodo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new NotFoundException(\Todo with ID \ not found\);
    }
    
    this.todos.splice(index, 1);
  }

  toggleComplete(id: number): Todo {
    const index = this.todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new NotFoundException(\Todo with ID \ not found\);
    }
    
    this.todos[index] = {
      ...this.todos[index],
      completed: !this.todos[index].completed,
      updatedAt: new Date()
    };
    
    return this.todos[index];
  }
}
