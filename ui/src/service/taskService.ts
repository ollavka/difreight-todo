import { httpClient } from '../http';
import { Task } from '../types';

export const getAll = async () => {
  return httpClient.get<void, Task[]>('/tasks');
};

export const getOne = async (id: string) => {
  return httpClient.get<void, Task>(`/tasks/${id}`);
};

export const create = async (task: FormData) => {
  return httpClient.post<void, Task>('/tasks', task);
};

export const update = async (taskId: string, task: FormData) => {
  return httpClient.put<void, Task>(`/tasks/${taskId}`, task);
};

export const remove = async (id: string) => {
  return httpClient.delete<void, void>(`/tasks/${id}`);
};
