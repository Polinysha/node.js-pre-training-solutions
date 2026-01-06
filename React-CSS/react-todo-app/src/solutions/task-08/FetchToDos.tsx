import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const FetchToDos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: Todo[] = [
          { id: 1, title: 'Buy milk', completed: false },
          { id: 2, title: 'Walk the dog', completed: true },
          { id: 3, title: 'Learn React', completed: false }
        ];
        
        setTodos(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch todos');
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Fetched ToDos</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#666' : '#000'
            }}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
