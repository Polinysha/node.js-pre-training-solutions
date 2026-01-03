import { TodoService } from './JS-TS/solutions/todo-service';
import { ToDoManager } from './JS-TS/solutions/todo-manager';
import { TodoStatus } from './JS-TS/solutions/types';

async function testTask08Scenario() {
    console.log('=== Testing Task 08 Scenario ===');
    const service = new TodoService();
    
    service.clear();
    
    await service.create('service task one');
    await service.create('service task two');
    
    const found = await service.search('service');
    console.log('Search results:', found.map(t => ({ title: t.title, status: t.status })));
    
    if (found.length > 0) {
        const todo = found[0];
        console.log('Before toggle - status:', todo.status);
        
        const toggled = await service.toggleStatus(todo.id);
        console.log('After toggle - status:', toggled.status);
        console.log('Status changed:', todo.status !== toggled.status);
        
        console.log('Test will pass:', toggled.status !== todo.status);
    }
}

async function testTask10Scenario() {
    console.log('\n=== Testing Task 10 Scenario ===');
    const manager = new ToDoManager();
    
    await manager.init();
    await manager.add('CLI Item');
    
    const list = await manager.list();
    const item = list.find(t => t.title === 'CLI Item');
    
    if (item) {
        console.log('Before complete - status:', item.status);
        await manager.complete(item.id);
        
        const updatedList = await manager.list();
        const completed = updatedList.find(t => t.id === item.id);
        
        console.log('After complete - status:', completed?.status);
        console.log('Status changed:', item.status !== completed?.status);
        console.log('Test will pass:', completed?.status !== item.status);
    }
}

async function main() {
    await testTask08Scenario();
    await testTask10Scenario();
}

main().catch(console.error);
