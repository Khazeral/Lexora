import Card from '#models/card'
import CardProgress from '#models/card_progress'
import User from '#models/user'

export default class CardProgressSeeder {
  async run() {
    const user = await User.firstOrFail()
    const cards = await Card.all()

    for (const card of cards) {
      await CardProgress.create({
        userId: user.id,
        cardId: card.id,
        successCount: 0,
        failureCount: 0,
        currentStreak: 0,
        maxStreak: 0,
        status: 'bronze',
        isSecret: false,
      })
    }
  }
}
