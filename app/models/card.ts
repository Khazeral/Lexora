import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Deck from './deck.js'
import CardProgress from './card_progress.js'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare word: string

  @column()
  declare translation: string

  @column()
  declare deckId: number

  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>

  @hasMany(() => CardProgress)
  declare progress: HasMany<typeof CardProgress>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
