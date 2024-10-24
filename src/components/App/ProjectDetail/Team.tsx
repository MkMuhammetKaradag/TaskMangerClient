import React, { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import { BaseUser, TaskDetail } from '../../../types/graphql';
interface TeamProps {
  team: BaseUser[];
  tasks: TaskDetail[];
}
const Team: FC<TeamProps> = ({ team, tasks }) => {
  const calculateUserTaskStats = (userId: string, tasks: any[]) => {
    const userTasks = tasks.filter((task) => task.assignee._id === userId);
    const stats = {
      total: userTasks.length,
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };

    userTasks.forEach((task) => {
      switch (task.status) {
        case 'TODO':
          stats.todo++;
          break;
        case 'IN_PROGRESS':
          stats.in_progress++;
          break;
        case 'REVIEW':
          stats.review++;
          break;
        case 'DONE':
          stats.done++;
          break;
      }
    });

    return stats;
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => {
          const stats = calculateUserTaskStats(member._id, tasks);
          return (
            <div key={member._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center mb-4">
                {member.profilePhoto ? (
                  <img
                    src={member.profilePhoto}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{`${member.firstName} ${member.lastName}`}</h3>
                  <p className="text-sm text-gray-600">
                    Total Tasks: {stats.total}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Task Distribution</h4>
                <Pie
                  data={{
                    labels: ['Todo', 'In Progress', 'Review', 'Done'],
                    datasets: [
                      {
                        data: [
                          stats.todo,
                          stats.in_progress,
                          stats.review,
                          stats.done,
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
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          font: {
                            size: 10,
                          },
                        },
                      },
                      title: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
