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
    return response.ok(achievements)
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
        cards: achievements.filter((a) => a.category === 'cards'),
        training: achievements.filter((a) => a.category === 'training'),
        streaks: achievements.filter((a) => a.category === 'streaks'),
        collection: achievements.filter((a) => a.category === 'collection'),
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
