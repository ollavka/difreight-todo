export type ApiError = {
  message: string;
  status: number;
  errors: Record<string, string>;
};

export enum TaskStatus {
  ToDo = 'todo',
  InProgress = 'inProgress',
  Completed = 'completed',
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  filePath: string;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskStatusKey = `${TaskStatus}`;

export type ColumnData = {
  id: TaskStatusKey;
  list: Task[];
  label: string;
};

export type Columns = Record<TaskStatus, ColumnData>;
