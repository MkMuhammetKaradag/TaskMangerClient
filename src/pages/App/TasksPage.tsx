import { KanbanBoard } from '../../components/App/Tasks/KanbanBoard';
import { useQuery } from '@apollo/client';
import { GET_ALL_MY_TASKS } from '../../graphql/queries';
import { Task } from '../../types/graphql';

interface MyTasksQueryResult {
  getAllMyTasks: Task[];
}

const TasksPage = () => {
  const { data, loading, error } =
    useQuery<MyTasksQueryResult>(GET_ALL_MY_TASKS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>data is null</div>;

  
  return (
    <div>
      <KanbanBoard initialTasks={data.getAllMyTasks} />
    </div>
  );
};

export default TasksPage;
