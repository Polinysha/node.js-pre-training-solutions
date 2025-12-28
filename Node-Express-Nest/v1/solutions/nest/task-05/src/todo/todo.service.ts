import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    
    if (!todo) {
      throw new NotFoundException(\Todo with ID \ not found\);
    }
    
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    
    // Update todo with DTO data
    const updatedTodo = this.todoRepository.merge(todo, updateTodoDto);
    updatedTodo.updatedAt = new Date();
    
    return await this.todoRepository.save(updatedTodo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(\Todo with ID \ not found\);
    }
  }
}
