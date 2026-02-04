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

    for (const card of cards) {
      await CardProgress.firstOrCreate(
        {
          userId: user.id,
          cardId: card.id,
        },
        {
          userId: user.id,
          cardId: card.id,
          successCount: 0,
          failureCount: 0,
          currentStreak: 0,
          maxStreak: 0,
          status: 'bronze',
        }
      )
    }
  }
}
