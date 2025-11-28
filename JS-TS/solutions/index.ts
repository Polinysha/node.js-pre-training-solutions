//10.1
#!/usr/bin/env node

import { ToDoManager } from './todo-manager';
import { TodoStatus } from './types';

class TodoCLI {
    private manager: ToDoManager;

    constructor() {
        this.manager = new ToDoManager();
    }

    async handleCommand(): Promise<void> {
        const args = process.argv.slice(2);
        const command = args[0];

        try {
            switch (command) {
                case 'init':
                    await this.manager.init();
                    console.log('Todo manager initialized with demo data');
                    break;

                case 'add':
                    if (args.length < 2) {
                        console.log('Usage: add <title> [description]');
                        return;
                    }
                    const title = args[1];
                    const description = args[2] || '';
                    await this.manager.add(title, description);
                    console.log(`Added: "${title}"`);
                    break;

                case 'complete':
                    if (args.length < 2) {
                        console.log('Usage: complete <id>');
                        return;
                    }
                    const id = parseInt(args[1]);
                    await this.manager.complete(id);
                    console.log(`Completed todo with ID: ${id}`);
                    break;

                case 'list':
                    const todos = await this.manager.list();
                    if (todos.length === 0) {
                        console.log('No todos found');
                        return;
                    }
                    console.log('All todos:');
                    todos.forEach(todo => {
                        const statusIcon = todo.status === TodoStatus.COMPLETED ? '✅' : 
                                         todo.status === TodoStatus.IN_PROGRESS ? '🔄' : '⏳';
                        console.log(`${statusIcon} [${todo.id}] ${todo.title}`);
                        if (todo.description) {
                            console.log(`   📝 ${todo.description}`);
                        }
                        console.log(`   📅 ${todo.createdAt.toLocaleDateString()}`);
                    });
                    break;

                case 'help':
                default:
                    this.showHelp();
                    break;
            }
        } catch (error) {
            console.error('Error:', error instanceof Error ? error.message : error);
        }
    }

    private showHelp(): void {
        console.log(`
Todo Manager CLI - Usage:
  npm run todo init                    - Initialize with demo data
  npm run todo add <title> [desc]      - Add a new todo
  npm run todo complete <id>           - Mark todo as completed
  npm run todo list                    - List all todos
  npm run todo help                    - Show this help message

Examples:
  npm run todo add "Learn Node.js"
  npm run todo add "Build API" "Create RESTful endpoints"
  npm run todo complete 1
  npm run todo list
        `);
    }
}

// Запуск CLI
if (require.main === module) {
    const cli = new TodoCLI();
    cli.handleCommand().catch(console.error);
}

export { TodoCLI };
