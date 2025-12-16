import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const CompleteToDoList: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build Todo App', completed: false }
  ]);

  const handleAdd = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now(),
      title: inputValue.trim(),
      completed: false
    };
    
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setInputValue('');
  };

  const handleComplete = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Add todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <button 
          onClick={handleAdd}
          style={{ padding: '5px 15px' }}
        >
          Add
        </button>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{ 
              margin: '10px 0',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: todo.completed ? '#e8f5e8' : '#fff'
            }}
          >
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#666' : '#000',
                flex: 1
              }}
            >
              {todo.title}
              {todo.completed && ' ✓'}
            </span>
            
            <button
              onClick={() => handleComplete(todo.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: todo.completed ? '#4caf50' : '#f5f5f5',
                color: todo.completed ? 'white' : '#333',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {todo.completed ? 'Completed' : 'Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
