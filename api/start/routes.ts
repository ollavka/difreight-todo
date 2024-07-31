import router from '@adonisjs/core/services/router'

const TasksController = () => import('#controllers/tasks_controller')
const FilesContoller = () => import('#controllers/files_controller')

router.get('/', async ({ response }) => {
  return response.status(200).send('OK')
})

// @ts-ignore
router.resource('tasks', TasksController).apiOnly()

router.get('/files/:taskId', [FilesContoller, 'download'])
