import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import CardProgress from './card_progress.js'
import Deck from './deck.js'
import Achievement from './achievement.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Deck)
  declare decks: HasMany<typeof Deck>

  @hasMany(() => CardProgress)
  declare cardProgresses: HasMany<typeof CardProgress>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Achievement, {
    pivotTable: 'user_achievements',
    pivotColumns: ['progress', 'target', 'unlocked', 'unlocked_at'],
  })
  declare achievements: ManyToMany<typeof Achievement>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
