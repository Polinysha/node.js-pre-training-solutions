"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
describe('InMemoryRepository', () => {
    let repository;
    beforeEach(() => {
        repository = new repository_1.InMemoryRepository();
    });
    test('add and findById work correctly', async () => {
        const entity = { id: 1, name: 'Test' };
        await repository.add(entity);
        const found = repository.findById(1);
        expect(found).toEqual(entity);
    });
    test('findAll returns all entities', async () => {
        await repository.add({ id: 1, name: 'Test1' });
        await repository.add({ id: 2, name: 'Test2' });
        const all = repository.findAll();
        expect(all).toHaveLength(2);
    });
    test('findById returns undefined for non-existent entity', () => {
        const found = repository.findById(999);
        expect(found).toBeUndefined();
    });
    test('update modifies existing entity', async () => {
        const entity = { id: 1, name: 'Original' };
        await repository.add(entity);
        const updated = await repository.update(1, { name: 'Updated' });
        expect(updated.name).toBe('Updated');
    });
    test('update throws error for non-existent entity', async () => {
        await expect(repository.update(999, { name: 'Updated' }))
            .rejects.toThrow('Entity with id 999 not found');
    });
    test('remove deletes entity', async () => {
        const entity = { id: 1, name: 'Test' };
        await repository.add(entity);
        await repository.remove(1);
        expect(repository.findById(1)).toBeUndefined();
    });
});
