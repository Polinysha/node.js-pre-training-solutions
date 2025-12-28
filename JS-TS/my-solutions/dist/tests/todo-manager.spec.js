"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_manager_1 = require("../todo-manager");
describe('ToDoManager', () => {
    let manager;
    beforeEach(() => {
        manager = new todo_manager_1.ToDoManager();
    });
    test('should create instance', () => {
        expect(manager).toBeInstanceOf(todo_manager_1.ToDoManager);
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
