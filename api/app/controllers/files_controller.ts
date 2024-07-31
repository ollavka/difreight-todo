import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import fs from 'fs'
import path from 'path'

export default class FilesController {
  async download({ params, response }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.taskId)

      if (task.filePath && fs.existsSync(task.filePath)) {
        const fileName = path.basename(task.filePath)

        response.header('Content-Disposition', `attachment; filename="${fileName}"`)

        return response.download(task.filePath)
      }

      return task
    } catch (_err) {
      return response.status(404).send({ message: 'Task not found', errors: null })
    }
  }
}
