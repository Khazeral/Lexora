import User from '../../backend/app/models/user.js'
import Card from '../../backend/app/models/card.js'
import CardProgress from '../../backend/app/models/card_progress.js'

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
