export interface Repository<T> {
    add(entity: T): T;
    update(id: number, patch: Partial<T>): T;
    remove(id: number): void;
    findById(id: number): T | undefined;
    findAll(): T[];
}

export class InMemoryRepository<T extends { id: number }> implements Repository<T> {
    private entities: T[] = [];

    add(entity: T): T {
        this.entities.push(entity);
        return entity;
    }

    update(id: number, patch: Partial<T>): T {
        const index = this.entities.findIndex(entity => entity.id === id);
        if (index === -1) {
            throw new Error(`Entity with id ${id} not found`);
        }
        
        this.entities[index] = { ...this.entities[index], ...patch };
        return this.entities[index];
    }

    remove(id: number): void {
        this.entities = this.entities.filter(entity => entity.id !== id);
    }

    findById(id: number): T | undefined {
        return this.entities.find(entity => entity.id === id);
    }

    findAll(): T[] {
        return [...this.entities];
    }
}
