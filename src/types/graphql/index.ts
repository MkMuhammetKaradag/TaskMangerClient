export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}
export interface Project {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
}
export interface TaskSummary {
  totalTasks: number;
  todoTasks: number;
  in_progressTasks: number;
  reviewTasks: number;
  doneTasks: number;
}

export interface ProjectDetail extends Project {
  projectManager: BaseUser;
  team: BaseUser[];
  taskSummary: TaskSummary;
  tasks: TaskDetail[];
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}
interface SubTask {
  _id: string;
  title: string;
}

interface ParentTask {
  _id: string;
  title: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  parentTask: ParentTask | null;
  subTasks: SubTask[];
}
export interface BaseUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}
export interface TaskDetail extends Task {
  assignee: BaseUser;
  project: {
    _id: string;
    name: string;
  };
  createdByUser: BaseUser;
}
