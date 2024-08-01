import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import * as fileService from '#services/file_service'
import * as taskService from '#services/task_service'
import { TaskStatus } from '#types'

export default class TasksController {
  /**
   * Retrieve all tasks
   */
  availableFileExtnames = ['txt', 'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']

  async index({ response }: HttpContext) {
    try {
      const tasks = await Task.all()

      return response.send(tasks)
    } catch (_err) {
      return response.status(404).send({ message: 'Not found' })
    }
  }

  /**
   * Retrieve specific task
   */
  async show({ params, response }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.id)

      return response.send(task)
    } catch (_err) {
      return response.status(404).send({ message: 'Task not found', errors: null })
    }
  }

  /**
   * Create new task
   */
  async store({ request, response }: HttpContext) {
    const file = request.file('file', {
      extnames: this.availableFileExtnames,
    })

    const { title = '', description = '' } = request.only(['title', 'description'])

    if (!title || !description || (file && !file?.isValid)) {
      const errors: Record<string, string> = taskService.getTaskErrors(
        { title, description, file },
        this.availableFileExtnames
      )

      return response.status(400).send({ message: 'Invalid data', errors })
    }

    await fileService.save(file)

    const newTask = await Task.create({
      id: crypto.randomUUID(),
      title,
      description,
      filePath: file?.filePath ?? '',
      status: TaskStatus.ToDo,
    })

    return response.status(201).send(newTask)
  }

  /**
   * Update task
   */
  async update({ params, request, response }: HttpContext) {
    const file = request.file('file', {
      extnames: this.availableFileExtnames,
    })

    const {
      title = '',
      description = '',
      status = TaskStatus.ToDo,
    } = request.only(['title', 'description', 'status'])

    if (!Object.values(TaskStatus).includes(status)) {
      return response.status(400).send({ message: 'Invalid task status', errors: null })
    }

    if (!title || !description || (file && !file?.isValid)) {
      const errors: Record<string, string> = taskService.getTaskErrors(
        { title, description, file },
        this.availableFileExtnames
      )

      return response.status(400).send({ message: 'Invalid data', errors })
    }

    try {
      const task = await Task.findOrFail(params.id)

      await fileService.remove(response, task.filePath)

      if (file) {
        await fileService.save(file)
      }

      task.filePath = file?.filePath ?? ''

      await task.merge({ title, description, status }).save()

      return response.send(task)
    } catch (_err) {
      return response.status(404).send({ message: 'Not found', errors: null })
    }
  }

  /**
   * Delete task
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.id)

      await fileService.remove(response, task.filePath)

      await task.delete()

      return response.status(204)
    } catch (_err) {
      return response.status(404).send({ message: 'Not found', errors: null })
    }
  }
}
