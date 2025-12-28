"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRepository = void 0;
class InMemoryRepository {
    constructor() {
        this.entities = [];
    }
    async add(entity) {
        this.entities.push(entity);
        return entity;
    }
    async update(id, patch) {
        const index = this.entities.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error(`Entity with id ${id} not found`);
        }
        const updatedEntity = {
            ...this.entities[index],
            ...patch,
            id: this.entities[index].id
        };
        this.entities[index] = updatedEntity;
        return updatedEntity;
    }
    async remove(id) {
        const index = this.entities.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error(`Entity with id ${id} not found`);
        }
        this.entities.splice(index, 1);
    }
    findById(id) {
        return this.entities.find(e => e.id === id);
    }
    findAll() {
        return [...this.entities];
    }
}
exports.InMemoryRepository = InMemoryRepository;
