import Task from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'

export type MultipartFile = ReturnType<HttpContext['request']['file']>

export type TaskDTO = Pick<Task, 'title' | 'description'> & {
  file: MultipartFile
}

export enum TaskStatus {
  ToDo = 'todo',
  InProgress = 'inProgress',
  completed = 'completed',
}
