export class InMemoryRepository<T extends { id: number }> {
    private entities: T[] = [];

    async add(entity: T): Promise<T> {
        this.entities.push(entity);
        return entity;
    }

    async update(id: number, patch: Partial<T>): Promise<T> {
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

    async remove(id: number): Promise<void> {
        const index = this.entities.findIndex(e => e.id === id);
        
        if (index === -1) {
            throw new Error(`Entity with id ${id} not found`);
        }
        
        this.entities.splice(index, 1);
    }

    findById(id: number): T | undefined {
        return this.entities.find(e => e.id === id);
    }

    findAll(): T[] {
        return [...this.entities];
    }
}