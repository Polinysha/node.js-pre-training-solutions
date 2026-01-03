import { TodoService } from './JS-TS/solutions/todo-service';

async function debugTask08() {
    console.log('=== Debug Task 08 ===');
    const service = new TodoService();
    
    service.clear();
    
    await service.create('service task one');
    await service.create('service task two');
    
    console.log('All tasks after creation:');
    const allTasks = await service.getAll();
    allTasks.forEach(t => console.log(`  - ${t.title}: ${t.status}`));
    
    const found = await service.search('service');
    console.log('Found tasks with "service":', found.length);
    
    if (found.length > 0) {
        const todo = found[0];
        console.log('First found task:', {
            id: todo.id,
            title: todo.title, 
            status: todo.status
        });
        
        const toggled = await service.toggleStatus(todo.id);
        console.log('After toggle:', {
            original: todo.status,
            new: toggled.status,
            changed: todo.status !== toggled.status
        });
    }
}

debugTask08().catch(console.error);
