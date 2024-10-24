import { FC } from 'react';
import { TaskSummary as TaskSummaryType } from '../../../types/graphql';
import { Pie } from 'react-chartjs-2';

interface TaskSummaryProps {
  taskSummary: TaskSummaryType;
}
const TaskSummary: FC<TaskSummaryProps> = ({ taskSummary }) => {
  const taskData = {
    labels: ['Todo', 'In Progress', 'Review', 'Done'],
    datasets: [
      {
        data: [
          taskSummary.todoTasks,
          taskSummary.in_progressTasks,
          taskSummary.reviewTasks,
          taskSummary.doneTasks,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Task Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <p className="font-semibold">Total Tasks</p>
              <p className="text-2xl">{taskSummary.totalTasks}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <p className="font-semibold">Todo Tasks</p>
              <p className="text-2xl">{taskSummary.todoTasks}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded">
              <p className="font-semibold">In Progress</p>
              <p className="text-2xl">{taskSummary.in_progressTasks}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded">
              <p className="font-semibold">Review</p>
              <p className="text-2xl">{taskSummary.reviewTasks}</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <p className="font-semibold">Done</p>
              <p className="text-2xl">{taskSummary.doneTasks}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Task Distribution</h3>
          <Pie
            data={taskData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: true,
                  text: 'Task Status Distribution',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskSummary;
