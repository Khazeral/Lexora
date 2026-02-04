import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'achievements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').unique().notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.string('icon').notNullable()
      table.string('category').notNullable()
      table.enum('rarity', ['common', 'rare', 'epic', 'legendary']).defaultTo('common')
      table.boolean('is_secret').defaultTo(false)
      table.json('conditions').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
