import React from 'react';
import styles from './CompletedTodo.module.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface StyledToDoItemProps {
  todo: Todo;
}

export const StyledToDoItem: React.FC<StyledToDoItemProps> = ({ todo }) => {
  return (
    <div className={todo.completed ? styles.completed : ''}>
      {todo.title}
      {todo.completed && <span> (Completed)</span>}
    </div>
  );
};
