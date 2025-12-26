import { ToDoManager } from '../todo-manager';

describe('ToDoManager', () => {
    let manager: ToDoManager;

    beforeEach(() => {
        manager = new ToDoManager();
    });

    test('should create instance', () => {
        expect(manager).toBeInstanceOf(ToDoManager);
    });

    test('should have init method', () => {
        expect(typeof manager.init).toBe('function');
    });

    test('should have add method', () => {
        expect(typeof manager.add).toBe('function');
    });

    test('should have complete method', () => {
        expect(typeof manager.complete).toBe('function');
    });

    test('should have list method', () => {
        expect(typeof manager.list).toBe('function');
    });
});
