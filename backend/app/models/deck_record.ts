import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Deck from '#models/deck'

export default class DeckRecord extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare deckId: number

  @column()
  declare bestSpeedRunTime: number | null

  @column()
  declare speedRunAttempts: number

  @column()
  declare bestStreak: number

  @column()
  declare streakMasterAttempts: number

  @column()
  declare bestAvgTimePerCard: number | null

  @column()
  declare timeAttackAttempts: number

  @column()
  declare perfectRunsCompleted: number

  @column()
  declare perfectRunAttempts: number

  @column()
  declare totalSessions: number

  @column.dateTime()
  declare lastPlayedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>
}
