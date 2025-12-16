#!/usr/bin/env ts-node

import { TodoService } from './todo-service';
import { TodoStatus } from './types';

class ToDoManager {
    private service = new TodoService();

    async init(): Promise<void> {
        console.log('Todo Manager initialized');
    }

    async add(title: string, description = ''): Promise<void> {
        const todo = await this.service.create(title, description);
        console.log(`Added: ${todo.title} (ID: ${todo.id})`);
    }

    async complete(id: number): Promise<void> {
        const todo = await this.service.toggleStatus(id);
        console.log(`Completed: ${todo.title}`);
    }

    async list(): Promise<void> {
        const todos = await this.service.getAll();
        console.log('All todos:');
        todos.forEach(todo => {
            console.log(`- [${todo.status}] ${todo.title} (ID: ${todo.id})`);
        });
    }
}

// CLI interface
async function main() {
    const manager = new ToDoManager();
    await manager.init();

    // Example usage
    await manager.add('Learn TypeScript');
    await manager.add('Build a project', 'Create a full-stack application');
    await manager.list();
}

if (require.main === module) {
    main().catch(console.error);
}

export { ToDoManager };
