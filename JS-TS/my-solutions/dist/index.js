"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_manager_1 = require("./todo-manager");
// Глобальная переменная для сохранения состояния между командами
let manager = null;
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    if (!manager) {
        manager = new todo_manager_1.ToDoManager();
    }
    try {
        switch (command) {
            case 'init':
                await manager.init();
                console.log('Todo manager initialized with demo data');
                break;
            case 'add':
                if (args.length < 2) {
                    console.log('Usage: node index.js add "title" [description]');
                    return;
                }
                await manager.add(args[1], args[2]);
                console.log('Todo added successfully');
                break;
            case 'complete':
                if (args.length < 2) {
                    console.log('Usage: node index.js complete <id>');
                    return;
                }
                const id = parseInt(args[1]);
                if (isNaN(id)) {
                    console.log('Error: ID must be a number');
                    return;
                }
                await manager.complete(id);
                console.log(`Todo ${id} marked as completed`);
                break;
            case 'list':
                const todos = await manager.list();
                if (todos.length === 0) {
                    console.log('No todos found');
                }
                else {
                    console.log('\nTodos:');
                    todos.forEach(todo => {
                        console.log(`[${todo.id}] ${todo.title} - ${todo.status}`);
                        if (todo.description) {
                            console.log(`   ${todo.description}`);
                        }
                    });
                }
                break;
            case 'demo':
                console.log('Running demo...');
                await manager.init();
                console.log('Initialized with demo data');
                const demoTodos = await manager.list();
                console.log(`Found ${demoTodos.length} todos`);
                break;
            case 'help':
            default:
                console.log(`
Todo Manager CLI Commands:
  init                    - Initialize with demo data
  add "title" [desc]     - Add a new todo
  complete <id>          - Mark todo as completed
  list                   - List all todos
  demo                   - Run a quick demo
  help                   - Show this help message

Note: This is an in-memory implementation. 
Each command runs in its own process, so data is not persisted between commands.
To see persistence, use the 'demo' command or run multiple commands in a script.
                `);
                break;
        }
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}
if (require.main === module) {
    main();
}
