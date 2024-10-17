import React from 'react';
import { useParams } from 'react-router-dom';

const TasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return <div>TasksPage</div>;
};

export default TasksPage;
