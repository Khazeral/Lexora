import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Card from '#models/card'
import CardProgress from '#models/card_progress'
import User from '#models/user'

export default class CardProgressSeeder extends BaseSeeder {
  async run() {
    const user = await User.query().first()

    if (!user) {
      console.log('No user found, skipping card progress seeder')
      return
    }

    const cards = await Card.all()

    if (cards.length === 0) {
      console.log('No cards found, skipping card progress seeder')
      return
    }

    // Les 9 premières cartes seront Silver (successCount = 15)
    const silverCards = cards.slice(0, 9)
    // Les 9 suivantes seront Bronze (successCount = 5)
    const bronzeCards = cards.slice(9, 18)

    // Créer les progressions Silver
    for (const card of silverCards) {
      await CardProgress.firstOrCreate(
        {
          userId: user.id,
          cardId: card.id,
        },
        {
          userId: user.id,
          cardId: card.id,
          successCount: 15,
          failureCount: 2,
          currentStreak: 3,
          maxStreak: 8,
          status: 'silver',
        }
      )
    }

    // Créer les progressions Bronze
    for (const card of bronzeCards) {
      await CardProgress.firstOrCreate(
        {
          userId: user.id,
          cardId: card.id,
        },
        {
          userId: user.id,
          cardId: card.id,
          successCount: 5,
          failureCount: 3,
          currentStreak: 2,
          maxStreak: 4,
          status: 'bronze',
        }
      )
    }
  }
}
