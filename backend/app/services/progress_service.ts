import CardProgress from '#models/card_progress'
import User from '#models/user'

export default class CardProgressService {
  async listByUser(userId: number) {
    return CardProgress.query().where('user_id', userId).preload('card')
  }

  async findByUserAndCard(userId: number, cardId: number) {
    return CardProgress.query().where('user_id', userId).andWhere('card_id', cardId).first()
  }

  async answer(userId: number, cardId: number, success: boolean) {
    let progress = await this.findByUserAndCard(userId, cardId)
    const user = await User.findOrFail(userId)

    // Mettre à jour la streak globale
    let newGlobalStreak = user.currentStreak
    if (success) {
      newGlobalStreak = user.currentStreak + 1
      user.currentStreak = newGlobalStreak
      if (newGlobalStreak > user.bestStreak) {
        user.bestStreak = newGlobalStreak
      }
    } else {
      user.currentStreak = 0
    }
    await user.save()

    if (!progress) {
      progress = await CardProgress.create({
        userId,
        cardId,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        currentStreak: success ? 1 : 0,
        maxStreak: success ? 1 : 0,
        status: 'bronze',
      })
      return {
        progress,
        newStatus: null,
        firstTimeStatus: null,
        globalStreak: newGlobalStreak,
      }
    }

    const oldStatus = progress.status
    const oldSuccessCount = progress.successCount

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

    if (progress.successCount >= 70) progress.status = 'ruby'
    else if (progress.successCount >= 50) progress.status = 'platinum'
    else if (progress.successCount >= 30) progress.status = 'gold'
    else if (progress.successCount >= 10) progress.status = 'silver'
    else progress.status = 'bronze'

    await progress.save()
    const newStatus = progress.status !== oldStatus ? progress.status : null

    let firstTimeStatus: string | null = null

    if (progress.successCount > oldSuccessCount) {
      if (progress.successCount >= 10 && oldSuccessCount < 10) {
        firstTimeStatus = 'silver'
      } else if (progress.successCount >= 30 && oldSuccessCount < 30) {
        firstTimeStatus = 'gold'
      } else if (progress.successCount >= 50 && oldSuccessCount < 50) {
        firstTimeStatus = 'platinum'
      } else if (progress.successCount >= 70 && oldSuccessCount < 70) {
        firstTimeStatus = 'ruby'
      }
    }

    return {
      progress,
      newStatus,
      firstTimeStatus,
      globalStreak: newGlobalStreak,
    }
  }

  async byDeck(userId: number, deckId: number) {
    return CardProgress.query()
      .where('user_id', userId)
      .preload('card', (q) => q.where('deck_id', deckId))
  }
}
