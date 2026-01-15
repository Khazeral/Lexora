import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Card from './card.js'

export default class CardProgress extends BaseModel {
  static table = 'card_progress'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare cardId: number

  @column()
  declare successCount: number

  @column()
  declare failureCount: number

  @column()
  declare currentStreak: number

  @column()
  declare maxStreak: number

  @column()
  declare status: 'bronze' | 'silver' | 'gold' | 'platinum' | 'ruby'

  @column()
  declare isSecret: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Card)
  declare card: BelongsTo<typeof Card>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
