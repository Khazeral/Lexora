import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'card_progress'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.integer('card_id').unsigned().references('id').inTable('cards').onDelete('CASCADE')

      table.integer('success_count').defaultTo(0)
      table.integer('failure_count').defaultTo(0)

      table.integer('current_streak').defaultTo(0)
      table.integer('max_streak').defaultTo(0)

      table.enu('status', ['bronze', 'silver', 'gold', 'platinum', 'ruby']).defaultTo('bronze')

      table.boolean('is_secret').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['user_id', 'card_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
