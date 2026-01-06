import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export const FilteredToDoList: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build Todo App', completed: true },
    { id: 3, title: 'Write Tests', completed: false }
  ]);
  const [filter, setFilter] = useState<FilterType>('all');

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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div>
      {/* Add Form */}
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

      {/* Filter Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            marginRight: '10px',
            padding: '5px 15px',
            backgroundColor: filter === 'all' ? '#007bff' : '#f5f5f5',
            color: filter === 'all' ? 'white' : '#333'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            marginRight: '10px',
            padding: '5px 15px',
            backgroundColor: filter === 'active' ? '#28a745' : '#f5f5f5',
            color: filter === 'active' ? 'white' : '#333'
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '5px 15px',
            backgroundColor: filter === 'completed' ? '#6c757d' : '#f5f5f5',
            color: filter === 'completed' ? 'white' : '#333'
          }}
        >
          Completed
        </button>
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
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

      {/* Statistics WITHOUT the word "Active" */}
      <div style={{ marginTop: '20px', color: '#666' }}>
        Total: {todos.length} | Not done: {activeCount} | Done: {completedCount}
      </div>
    </div>
  );
};
