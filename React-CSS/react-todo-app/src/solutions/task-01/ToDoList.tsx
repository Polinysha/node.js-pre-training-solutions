import React from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface ToDoListProps {
  todos: Todo[];
}

export const ToDoList: React.FC<ToDoListProps> = ({ todos }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => (
        <li 
          key={todo.id}
          style={{
            padding: '10px',
            margin: '5px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}
        >
          {todo.title} - {todo.completed ? 'completed' : 'not completed'}
        </li>
      ))}
    </ul>
  );
};
