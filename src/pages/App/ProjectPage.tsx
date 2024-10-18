import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_ALL_TASKS_BY_PROJECT } from '../../graphql/queries';
import { Task } from '../../types/graphql';

import TaskDiagram from '../../components/App/Project/TaskDiagram';

interface ProjectTasksQueryResult {
  getAllTasksByProject: Task[];
}

interface OperationVariables {
  projectId?: string;
}

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error } = useQuery<
    ProjectTasksQueryResult,
    OperationVariables
  >(GET_ALL_TASKS_BY_PROJECT, {
    variables: { projectId },
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data) {
      setTasks(data.getAllTasksByProject);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="">
      <h1>Project Tasks</h1>
      <div>
        <TaskDiagram tasks={tasks}></TaskDiagram>
      </div>
    </div>
  );
};

export default Project;
