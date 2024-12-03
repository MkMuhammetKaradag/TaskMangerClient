import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_ALL_TASKS_BY_PROJECT } from '../../graphql/queries';
import {
  ProjectDetail,
  Task,
} from '../../types/graphql';

import TaskDiagram from '../../components/App/Project/TaskDiagram';
import { useAppSelector } from '../../redux/hooks';
import { UserRole } from '../../types/redux';

interface ProjectTasksQueryResult {
  getAllTasksByProject: {
    tasks: Task[];
    project: ProjectDetail;
  };
}

interface OperationVariables {
  projectId?: string;
}

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const user = useAppSelector((s) => s.auth.user);
  const { data, loading, error } = useQuery<
    ProjectTasksQueryResult,
    OperationVariables
  >(GET_ALL_TASKS_BY_PROJECT, {
    variables: { projectId },
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPermission, setIsPermission] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setTasks(data.getAllTasksByProject.tasks);
      setIsPermission(
        data.getAllTasksByProject.project.projectManager._id == user?._id ||
          !!user?.roles.includes(UserRole.ADMIN)
      );
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // console.log(isPermission);
  return (
    <div className="">
      <h1>Project Tasks</h1>
      <div>
        <TaskDiagram tasks={tasks} isPermission={isPermission}></TaskDiagram>
      </div>
    </div>
  );
};

export default Project;
