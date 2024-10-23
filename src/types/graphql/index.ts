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
