import React from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface ActiveCountProps {
  todos: Todo[];
}

export const ActiveCount: React.FC<ActiveCountProps> = ({ todos }) => {
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div>
      {activeCount} active
    </div>
  );
};
