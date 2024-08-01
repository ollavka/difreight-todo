import { BaseSchema } from '@adonisjs/lucid/schema'
import { TaskStatus } from '#types'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.enum('status', Object.values(TaskStatus)).defaultTo(TaskStatus.ToDo).notNullable()
      table.string('file_path')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
