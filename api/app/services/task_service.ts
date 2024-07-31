import type { TaskDTO } from '#types'

export const getTaskErrors = ({ title, description, file }: TaskDTO, availableFileExtnames: string[]) => {
  const errors: Record<string, string> = {
    title: '',
    description: '',
    filePath: '',
  }

  if (!title) {
    errors.title = 'Title cannot be empty'
  }

  if (!description) {
    errors.description = 'Description cannot be empty'
  }

  if (!file?.isValid) {
    errors.filePath = `A file with this file extension is not supported, use one of these: ${availableFileExtnames.join(', ')}`
  }

  return errors
}
