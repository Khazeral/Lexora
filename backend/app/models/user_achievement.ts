import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Achievement from './achievement.js'

export default class UserAchievement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare achievementId: number

  @column()
  declare progress: number

  @column()
  declare target: number

  @column()
  declare unlocked: boolean

  @column()
  declare seen: boolean

  @column.dateTime()
  declare unlockedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Achievement)
  declare achievement: BelongsTo<typeof Achievement>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
