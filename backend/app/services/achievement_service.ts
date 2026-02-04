// app/services/achievement_service.ts
import Achievement from '#models/achievement'
import UserAchievement from '#models/user_achievement'
import Deck from '#models/deck'
import DeckRecord from '#models/deck_record'
import CardProgress from '#models/card_progress'
import { DateTime } from 'luxon'

export type AchievementEvent =
  | { type: 'card_created'; userId: number }
  | { type: 'card_status_changed'; userId: number; status: string }
  | { type: 'training_completed'; userId: number; mode: string; isPerfect?: boolean }
  | { type: 'streak_reached'; userId: number; streak: number }
  | { type: 'deck_created'; userId: number }
  | { type: 'total_correct'; userId: number; count: number }

export default class AchievementService {
  async processEvent(event: AchievementEvent): Promise<UserAchievement[]> {
    const unlockedAchievements: UserAchievement[] = []

    const achievements = await this.getAchievementsForEvent(event.type)

    for (const achievement of achievements) {
      const result = await this.checkAndUpdateAchievement(event.userId, achievement, event)
      if (result?.unlocked && result.unlockedAt) {
        // Vérifier si c'est un nouveau déblocage (débloqué maintenant)
        const justUnlocked = result.unlockedAt.diffNow('seconds').seconds > -5 // Débloqué dans les 5 dernières secondes
        if (justUnlocked) {
          unlockedAchievements.push(result)
        }
      }
    }

    return unlockedAchievements
  }

  private async getAchievementsForEvent(eventType: string): Promise<Achievement[]> {
    const typeToCondition: Record<string, string[]> = {
      card_created: ['cards_created'],
      card_status_changed: ['card_status'],
      training_completed: ['trainings_completed'],
      streak_reached: ['streak'],
      deck_created: ['decks_created'],
      total_correct: ['total_correct'],
    }

    const conditionTypes = typeToCondition[eventType]
    if (!conditionTypes) return []

    const achievements = await Achievement.all()
    return achievements.filter((a) => conditionTypes.includes(a.conditions.type))
  }

  private async checkAndUpdateAchievement(
    userId: number,
    achievement: Achievement,
    event: AchievementEvent
  ): Promise<UserAchievement | null> {
    let userAchievement = await UserAchievement.query()
      .where('user_id', userId)
      .where('achievement_id', achievement.id)
      .first()

    if (!userAchievement) {
      userAchievement = await UserAchievement.create({
        userId,
        achievementId: achievement.id,
        progress: 0,
        target: achievement.conditions.target,
        unlocked: false,
      })
    }

    // Si déjà débloqué, ne rien faire
    if (userAchievement.unlocked) {
      return userAchievement
    }

    // Calculer la nouvelle progression
    const newProgress = await this.calculateProgress(userId, achievement, event)
    userAchievement.progress = newProgress

    // Vérifier si l'achievement est débloqué
    if (newProgress >= userAchievement.target) {
      userAchievement.unlocked = true
      userAchievement.unlockedAt = DateTime.now()
    }

    await userAchievement.save()
    return userAchievement
  }

  private async calculateProgress(
    userId: number,
    achievement: Achievement,
    event: AchievementEvent
  ): Promise<number> {
    const conditions = achievement.conditions

    switch (conditions.type) {
      case 'cards_created':
        return await this.countUserCards(userId)

      case 'card_status':
        if (event.type === 'card_status_changed' && conditions.status === event.status) {
          return await this.countCardsWithStatus(userId, conditions.status)
        }
        return 0

      case 'trainings_completed':
        return await this.countTrainings(userId, conditions.mode)

      case 'streak':
        if (event.type === 'streak_reached') {
          return event.streak
        }
        return 0

      case 'decks_created':
        return await this.countUserDecks(userId)

      case 'total_correct':
        return await this.countTotalCorrect(userId)

      default:
        return 0
    }
  }

  private async countUserCards(userId: number): Promise<number> {
    // Compter les cartes dans les decks de l'utilisateur
    const decks = await Deck.query().where('user_id', userId).preload('cards')
    let totalCards = 0
    for (const deck of decks) {
      totalCards += deck.cards.length
    }
    return totalCards
  }

  private async countCardsWithStatus(userId: number, status: string): Promise<number> {
    const count = await CardProgress.query()
      .where('user_id', userId)
      .where('status', status)
      .count('* as total')
      .first()
    return Number(count?.$extras.total) || 0
  }

  private async countTrainings(userId: number, mode?: string): Promise<number> {
    const query = DeckRecord.query().where('user_id', userId)

    if (mode) {
      // Compter les attempts pour un mode spécifique
      const record = await query.first()
      if (!record) return 0

      switch (mode) {
        case 'speedrun':
          return record.speedRunAttempts
        case 'streak':
          return record.streakMasterAttempts
        case 'timeattack':
          return record.timeAttackAttempts
        case 'perfect':
          return record.perfectRunAttempts
        default:
          return record.totalSessions
      }
    }

    // Compter toutes les sessions
    const records = await query
    let totalSessions = 0
    for (const record of records) {
      totalSessions += record.totalSessions
    }
    return totalSessions
  }

  private async countUserDecks(userId: number): Promise<number> {
    const count = await Deck.query().where('user_id', userId).count('* as total').first()
    return Number(count?.$extras.total) || 0
  }

  private async countTotalCorrect(userId: number): Promise<number> {
    const count = await CardProgress.query()
      .where('user_id', userId)
      .sum('success_count as total')
      .first()
    return Number(count?.$extras.total) || 0
  }

  async getUserAchievements(userId: number) {
    const achievements = await Achievement.all()
    const userAchievements = await UserAchievement.query().where('user_id', userId)

    return achievements.map((achievement) => {
      const userAchievement = userAchievements.find((ua) => ua.achievementId === achievement.id)

      const baseData = {
        id: achievement.id,
        code: achievement.code,
        progress: userAchievement?.progress || 0,
        target: achievement.conditions.target,
        unlocked: userAchievement?.unlocked || false,
        unlockedAt: userAchievement?.unlockedAt || null,
        rarity: achievement.rarity,
        category: achievement.category,
        isSecret: achievement.isSecret,
      }

      // Cacher les détails des achievements secrets non débloqués
      if (achievement.isSecret && !userAchievement?.unlocked) {
        return {
          ...baseData,
          name: '???',
          description: 'Achievement secret',
          icon: 'help-circle',
        }
      }

      return {
        ...baseData,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
      }
    })
  }
}
