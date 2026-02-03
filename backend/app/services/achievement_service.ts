// app/services/achievement_service.ts
import Achievement from '#models/achievement'
import UserAchievement from '#models/user_achievement'
import User from '#models/user'
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
      if (result?.unlocked) {
        unlockedAchievements.push(result)
      }
    }

    return unlockedAchievements
  }

  private async getAchievementsForEvent(eventType: string): Promise<Achievement[]> {
    const typeToCondition: Record<string, string> = {
      card_created: 'cards_created',
      card_status_changed: 'card_status',
      training_completed: 'trainings_completed',
      streak_reached: 'streak',
      deck_created: 'decks_created',
      total_correct: 'total_correct',
    }

    const conditionType = typeToCondition[eventType]
    if (!conditionType) return []

    const achievements = await Achievement.all()
    return achievements.filter((a) => a.conditions.type === conditionType)
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

    if (userAchievement.unlocked) {
      return null
    }

    const newProgress = await this.calculateProgress(userId, achievement, event)
    userAchievement.progress = newProgress

    if (newProgress >= userAchievement.target) {
      userAchievement.unlocked = true
      userAchievement.unlockedAt = DateTime.now()
    }

    await userAchievement.save()
    return userAchievement.unlocked ? userAchievement : null
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
        if (conditions.mode && event.type === 'training_completed') {
          if (conditions.mode !== event.mode) return 0
        }
        return await this.countTrainings(userId, conditions.mode)

      case 'streak':
        if (event.type === 'streak_reached') {
          return event.streak
        }
        return 0

      case 'decks_created':
        return await this.countUserDecks(userId)

      case 'total_correct':
        if (event.type === 'total_correct') {
          return event.count
        }
        return 0

      default:
        return 0
    }
  }

  private async countUserCards(userId: number): Promise<number> {
    const user = await User.query().where('id', userId).withCount('cards').first()
    return user?.$extras.cards_count || 0
  }

  private async countCardsWithStatus(userId: number, status: string): Promise<number> {
    const result = await UserAchievement.query()
      .from('progresses')
      .where('user_id', userId)
      .where('status', status)
      .count('* as count')
      .first()
    return result?.$extras.count || 0
  }

  private async countTrainings(userId: number, mode?: string): Promise<number> {
    // Logique pour compter les sessions d'entraînement
    // À adapter selon ta structure de données
    return 0
  }

  private async countUserDecks(userId: number): Promise<number> {
    const user = await User.query().where('id', userId).withCount('decks').first()
    return user?.$extras.decks_count || 0
  }

  private async addXpToUser(userId: number, xp: number): Promise<void> {
    await User.query().where('id', userId).increment('xp', xp)
  }

  async getUserAchievements(userId: number) {
    const achievements = await Achievement.all()
    const userAchievements = await UserAchievement.query().where('user_id', userId)

    return achievements.map((achievement) => {
      const userAchievement = userAchievements.find((ua) => ua.achievementId === achievement.id)

      return {
        ...achievement.serialize(),
        progress: userAchievement?.progress || 0,
        target: achievement.conditions.target,
        unlocked: userAchievement?.unlocked || false,
        unlockedAt: userAchievement?.unlockedAt,
        ...(achievement.isSecret && !userAchievement?.unlocked
          ? {
              name: '???',
              description: 'Achievement secret',
              icon: 'help-circle',
            }
          : {}),
      }
    })
  }
}
