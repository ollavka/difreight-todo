import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import { ApiError } from '#exceptions/api_error_exception'
import * as fileService from '#services/file_service'
import * as taskService from '#services/task_service'

export default class TasksController {
  /**
   * Retrieve all tasks
   */
  availableFileExtnames = ['txt', 'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']

  async index() {
    const tasks = await Task.all()

    return tasks
  }

  /**
   * Retrieve specific task
   */
  async show({ params }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.id)

      return task
    } catch (_err) {
      return ApiError.NotFound('Task not found')
    }
  }

  /**
   * Create new task
   */
  async store({ request }: HttpContext) {
    const file = request.file('file', {
      extnames: this.availableFileExtnames,
    })

    const { title = '', description = '' } = request.only(['title', 'description'])

    if (!title || !description || (file && !file?.isValid)) {
      const errors: Record<string, string> = taskService.getTaskErrors(
        { title, description, file },
        this.availableFileExtnames
      )

      return ApiError.BadRequest('Invalid data', errors)
    }

    await fileService.save(file)

    const newTask = await Task.create({
      id: crypto.randomUUID(),
      title,
      description,
      filePath: file?.filePath ?? '',
      completed: false,
    })

    return newTask
  }

  /**
   * Update task
   */
  async update({ params, request }: HttpContext) {
    const file = request.file('file', {
      extnames: this.availableFileExtnames,
    })

    const { title = '', description = '', completed = false } = request.only(['title', 'description', 'completed'])

    if (!title || !description || (file && !file?.isValid)) {
      const errors: Record<string, string> = taskService.getTaskErrors(
        { title, description, file },
        this.availableFileExtnames
      )

      return ApiError.BadRequest('Invalid data', errors)
    }

    try {
      const task = await Task.findOrFail(params.id)

      await fileService.remove(task.filePath)

      if (file) {
        await fileService.save(file)
      }

      task.filePath = file?.filePath ?? ''

      await task.merge({ title, description, completed }).save()

      return task
    } catch (_err) {
      return ApiError.NotFound()
    }
  }

  /**
   * Delete task
   */
  async destroy({ params }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.id)

      await fileService.remove(task.filePath)

      await task.delete()

      return
    } catch (_err) {
      return ApiError.NotFound()
    }
  }
}
