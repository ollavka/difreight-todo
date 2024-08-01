import { Task, Columns, TaskStatus } from '../types';

export const mapTasksToColumns = (tasks: Task[]) => {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status].list.push(task);
      return acc;
    },
    {
      [TaskStatus.ToDo]: {
        id: TaskStatus.ToDo,
        label: 'To Do',
        list: [],
      },
      [TaskStatus.InProgress]: {
        id: TaskStatus.InProgress,
        label: 'In Progress',
        list: [],
      },
      [TaskStatus.Completed]: {
        id: TaskStatus.Completed,
        label: 'Completed',
        list: [],
      },
    } as Columns
  );
};
