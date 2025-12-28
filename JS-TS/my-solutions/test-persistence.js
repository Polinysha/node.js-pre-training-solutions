// test-persistence.js
const { ToDoManager } = require('./dist/todo-manager');

async function test() {
    console.log('=== Тест сохранения в одном процессе ===\n');
    
    const manager = new ToDoManager();
    
    console.log('1. Инициализация...');
    await manager.init();
    
    console.log('\n2. Проверка после init:');
    let todos = await manager.list();
    console.log(`Найдено задач: ${todos.length}`);
    
    console.log('\n3. Добавляем новую задачу...');
    await manager.add('Новая задача', 'Добавлена вручную');
    
    console.log('\n4. Проверка после add:');
    todos = await manager.list();
    console.log(`Найдено задач: ${todos.length}`);
    todos.forEach(t => console.log(`  - ${t.title} (ID: ${t.id})`));
    
    console.log('\n✅ Данные сохраняются в рамках одного процесса!');
}

test().catch(console.error);
