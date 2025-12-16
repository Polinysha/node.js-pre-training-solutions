import React from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface ToDoItemProps {
  todo: Todo;
}

export const ToDoItem: React.FC<ToDoItemProps> = ({ todo }) => {
  return (
    <div style={{
      padding: '10px',
      margin: '5px 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: todo.completed ? '#e8f5e8' : '#fff'
    }}>
      <span style={{
        textDecoration: todo.completed ? 'line-through' : 'none',
        fontWeight: 'bold'
      }}>
        {todo.title}
      </span>
      <span style={{ marginLeft: '10px', color: '#666' }}>
        ({todo.completed ? 'completed' : 'not completed'})
      </span>
    </div>
  );
};
