import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Achievement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare icon: string

  @column()
  declare category: 'cards' | 'training' | 'streaks' | 'collection'

  @column()
  declare rarity: 'common' | 'rare' | 'epic' | 'legendary'

  @column()
  declare isSecret: boolean

  @column()
  declare conditions: {
    type: string
    target: number
    [key: string]: any
  }

  @manyToMany(() => User, {
    pivotTable: 'user_achievements',
    pivotColumns: ['progress', 'target', 'unlocked', 'unlocked_at'],
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
