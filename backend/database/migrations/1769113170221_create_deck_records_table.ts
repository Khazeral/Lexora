import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deck_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('deck_id').unsigned().notNullable()

      table.integer('best_speed_run_time').unsigned().nullable()
      table.integer('speed_run_attempts').unsigned().defaultTo(0)

      table.integer('best_streak').unsigned().defaultTo(0)
      table.integer('streak_master_attempts').unsigned().defaultTo(0)

      table.float('best_avg_time_per_card').unsigned().nullable()
      table.integer('time_attack_attempts').unsigned().defaultTo(0)

      table.integer('perfect_runs_completed').unsigned().defaultTo(0)
      table.integer('perfect_run_attempts').unsigned().defaultTo(0)

      table.integer('total_sessions').unsigned().defaultTo(0)
      table.timestamp('last_played_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('deck_id').references('id').inTable('decks').onDelete('CASCADE')

      table.unique(['user_id', 'deck_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
