import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { ApiError } from '#exceptions/api_error_exception'
import fs from 'fs'

type MultipartFile = ReturnType<HttpContext['request']['file']>

export const save = async (file: MultipartFile) => {
  if (!file) {
    return
  }

  await file.move(app.makePath('uploads'), {
    name: `${cuid()}.${file.extname}`,
  })
}

export const remove = async (filePath?: string) => {
  if (!filePath || !fs.existsSync(filePath)) {
    return
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return ApiError.InternalError('File deletion failed')
    }
  })
}
