import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const AddToDoForm: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Example todo', completed: false }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(), 
      title: inputValue.trim(),
      completed: false
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
    setInputValue(''); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Add todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            padding: '8px 12px',
            marginRight: '10px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
