import CardProgress from '#models/card_progress'

export default class CardProgressService {
  async listByUser(userId: number) {
    return CardProgress.query().where('user_id', userId).preload('card')
  }

  async findByUserAndCard(userId: number, cardId: number) {
    return CardProgress.query().where('user_id', userId).andWhere('card_id', cardId).first()
  }

  async answer(userId: number, cardId: number, success: boolean) {
    let progress = await this.findByUserAndCard(userId, cardId)

    if (!progress) {
      progress = await CardProgress.create({
        userId,
        cardId,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        currentStreak: success ? 1 : 0,
        maxStreak: success ? 1 : 0,
        status: 'bronze',
        isSecret: false,
      })
      return progress
    }

    if (success) {
      progress.successCount += 1
      progress.currentStreak += 1
      if (progress.currentStreak > progress.maxStreak) {
        progress.maxStreak = progress.currentStreak
      }
    } else {
      progress.failureCount += 1
      progress.currentStreak = 0
    }

    // Mise à jour du statut selon la streak
    if (progress.maxStreak >= 10) progress.status = 'ruby'
    else if (progress.maxStreak >= 7) progress.status = 'platinum'
    else if (progress.maxStreak >= 5) progress.status = 'gold'
    else if (progress.maxStreak >= 3) progress.status = 'silver'
    else progress.status = 'bronze'

    await progress.save()
    return progress
  }

  async byDeck(userId: number, deckId: number) {
    return CardProgress.query()
      .where('user_id', userId)
      .preload('card', (q) => q.where('deck_id', deckId))
  }
}
