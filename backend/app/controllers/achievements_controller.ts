import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AchievementService from '#services/achievement_service'

@inject()
export default class AchievementsController {
  constructor(private achievementService: AchievementService) {}

  async index({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const achievements = await this.achievementService.getUserAchievements(user.id)

    await this.achievementService.markAchievementsAsSeen(user.id)

    return response.ok(achievements)
  }

  async unseenCount({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const count = await this.achievementService.getUnseenCount(user.id)
    return response.ok({ count })
  }

  async check({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const { eventType, data } = request.only(['eventType', 'data'])

    if (!eventType) {
      return response.badRequest({ message: 'eventType is required' })
    }

    const event = {
      type: eventType,
      userId: user.id,
      ...data,
    }

    try {
      const unlockedAchievements = await this.achievementService.processEvent(event)

      const unlockedDetails = await Promise.all(
        unlockedAchievements.map(async (ua) => {
          await ua.load('achievement')
          return {
            id: ua.achievement.id,
            code: ua.achievement.code,
            name: ua.achievement.name,
            description: ua.achievement.description,
            icon: ua.achievement.icon,
            rarity: ua.achievement.rarity,
            category: ua.achievement.category,
            unlockedAt: ua.unlockedAt,
          }
        })
      )

      return response.ok({
        checked: true,
        unlocked: unlockedDetails,
      })
    } catch (error) {
      console.error('Error checking achievements:', error)
      return response.internalServerError({ message: 'Failed to check achievements' })
    }
  }

  async stats({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const achievements = await this.achievementService.getUserAchievements(user.id)

    const stats = {
      total: achievements.length,
      unlocked: achievements.filter((a) => a.unlocked).length,
      byCategory: {
        cards: {
          total: achievements.filter((a) => a.category === 'cards').length,
          unlocked: achievements.filter((a) => a.category === 'cards' && a.unlocked).length,
        },
        training: {
          total: achievements.filter((a) => a.category === 'training').length,
          unlocked: achievements.filter((a) => a.category === 'training' && a.unlocked).length,
        },
        streaks: {
          total: achievements.filter((a) => a.category === 'streaks').length,
          unlocked: achievements.filter((a) => a.category === 'streaks' && a.unlocked).length,
        },
        collection: {
          total: achievements.filter((a) => a.category === 'collection').length,
          unlocked: achievements.filter((a) => a.category === 'collection' && a.unlocked).length,
        },
      },
      byRarity: {
        common: achievements.filter((a) => a.rarity === 'common' && a.unlocked).length,
        rare: achievements.filter((a) => a.rarity === 'rare' && a.unlocked).length,
        epic: achievements.filter((a) => a.rarity === 'epic' && a.unlocked).length,
        legendary: achievements.filter((a) => a.rarity === 'legendary' && a.unlocked).length,
      },
    }

    return response.ok(stats)
  }
}
