import { TaskPriority, TaskStatus } from '../types/graphql';

export const getTaskPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.URGENT:
      return '#ff4d4d';
    case TaskPriority.HIGH:
      return '#ffa64d';
    case TaskPriority.MEDIUM:
      return '#ffff4d';
    case TaskPriority.LOW:
      return '#a4f9a4';
    default:
      return '#ffffff';
  }
};

export const getTaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return '#e6e6e6';
    case TaskStatus.IN_PROGRESS:
      return '#66b3ff';
    case TaskStatus.REVIEW:
      return '#ffdb4d';
    case TaskStatus.DONE:
      return '#5cd65c';
    default:
      return '#ffffff';
  }
};

export const getTaskStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.REVIEW:
      return 'Review';
    case TaskStatus.DONE:
      return 'Done';
    default:
      return status;
  }
};
