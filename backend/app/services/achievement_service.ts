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
  | { type: 'session_time'; userId: number; hour: number }
  | { type: 'daily_sessions'; userId: number }
  | { type: 'user_comeback'; userId: number; daysAway: number }

export default class AchievementService {
  async processEvent(event: AchievementEvent): Promise<UserAchievement[]> {
    const unlockedAchievements: UserAchievement[] = []

    const achievements = await this.getAchievementsForEvent(event.type)

    for (const achievement of achievements) {
      const result = await this.checkAndUpdateAchievement(event.userId, achievement, event)
      if (result?.unlocked && result.unlockedAt) {
        const justUnlocked = result.unlockedAt.diffNow('seconds').seconds > -5
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
      session_time: ['time_of_day'],
      daily_sessions: ['daily_sessions'],
      user_comeback: ['comeback_days'],
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

    if (userAchievement.unlocked) {
      return userAchievement
    }

    const newProgress = await this.calculateProgress(userId, achievement, event)
    userAchievement.progress = newProgress

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

      case 'time_of_day':
        if (event.type === 'session_time') {
          const hour = event.hour
          if (hour >= conditions.startHour && hour < conditions.endHour) {
            return 1
          }
        }
        return 0

      case 'daily_sessions':
        if (event.type === 'daily_sessions') {
          return await this.countTodaySessions(userId)
        }
        return 0

      case 'comeback_days':
        if (event.type === 'user_comeback') {
          return event.daysAway >= conditions.target ? 1 : 0
        }
        return 0

      default:
        return 0
    }
  }

  private async countUserCards(userId: number): Promise<number> {
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
    const records = await DeckRecord.query().where('user_id', userId)

    if (records.length === 0) return 0

    if (mode) {
      let total = 0
      for (const record of records) {
        switch (mode) {
          case 'speedrun':
            total += record.speedRunAttempts || 0
            break
          case 'streak':
            total += record.streakMasterAttempts || 0
            break
          case 'timeattack':
            total += record.timeAttackAttempts || 0
            break
          case 'perfect':
            total += record.perfectRunAttempts || 0
            break
          case 'classic':
            total += record.totalSessions || 0
            break
        }
      }
      return total
    }

    let totalSessions = 0
    for (const record of records) {
      totalSessions += record.totalSessions || 0
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

  private async countTodaySessions(userId: number): Promise<number> {
    const today = DateTime.now().startOf('day')
    const tomorrow = today.plus({ days: 1 })

    const count = await DeckRecord.query()
      .where('user_id', userId)
      .where('last_played_at', '>=', today.toSQL())
      .where('last_played_at', '<', tomorrow.toSQL())
      .count('* as total')
      .first()

    return Number(count?.$extras.total) || 0
  }

  async getLastSessionDate(userId: number): Promise<DateTime | null> {
    const record = await DeckRecord.query()
      .where('user_id', userId)
      .whereNotNull('last_played_at')
      .orderBy('last_played_at', 'desc')
      .first()

    return record?.lastPlayedAt || null
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
