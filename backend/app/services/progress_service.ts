import CardProgress from '#models/card_progress'

type CardStatus = 'bronze' | 'silver' | 'gold' | 'platinum' | 'ruby'

export default class ProgressService {
  private getStatus(currentStreak: number): CardStatus {
    if (currentStreak >= 10) return 'ruby'
    if (currentStreak >= 20) return 'platinum'
    if (currentStreak >= 10) return 'gold'
    if (currentStreak >= 5) return 'silver'
    return 'bronze'
  }

  async answer(userId: number, cardId: number, correct: boolean) {
    let progress = await CardProgress.query()
      .where('user_id', userId)
      .where('card_id', cardId)
      .first()

    if (!progress) {
      progress = await CardProgress.create({
        userId,
        cardId,
        successCount: correct ? 1 : 0,
        failureCount: correct ? 0 : 1,
        currentStreak: correct ? 1 : 0,
        maxStreak: correct ? 1 : 0,
        status: correct ? 'bronze' : 'bronze',
        isSecret: false,
      })
    } else {
      if (correct) {
        progress.successCount += 1
        progress.currentStreak += 1
        if (progress.currentStreak > progress.maxStreak) {
          progress.maxStreak = progress.currentStreak
        }
      } else {
        progress.failureCount += 1
        progress.currentStreak = 0
      }

      progress.status = this.getStatus(progress.currentStreak)
      progress.isSecret = progress.currentStreak === 10
      await progress.save()
    }

    const easterEgg =
      progress.isSecret && progress.status === 'ruby' ? 'Congratulations! You earned a ruby!' : null

    return {
      successCount: progress.successCount,
      failureCount: progress.failureCount,
      currentStreak: progress.currentStreak,
      maxStreak: progress.maxStreak,
      status: progress.status,
      easterEgg,
    }
  }

  async listByUser(userId: number) {
    return CardProgress.query().where('user_id', userId)
  }

  async listByUserAndDeck(userId: number, deckId: number) {
    return CardProgress.query()
      .where('user_id', userId)
      .whereHas('card', (query) => query.where('deck_id', deckId))
  }

  async find(userId: number, cardId: number) {
    return CardProgress.query().where('user_id', userId).where('card_id', cardId).first()
  }
}
