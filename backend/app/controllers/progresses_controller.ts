import AchievementService from '#services/achievement_service'
import CardProgressService from '#services/progress_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProgressController {
  private service = new CardProgressService()
  private achievementService = new AchievementService()

  async index({ params, response }: HttpContext) {
    const progress = await this.service.listByUser(params.userId)
    return response.ok(progress)
  }

  async show({ params, response }: HttpContext) {
    const progress = await this.service.findByUserAndCard(params.userId, params.cardId)
    if (!progress) return response.notFound({ message: 'Progress not found' })
    return response.ok(progress)
  }

  async answer({ params, request, response }: HttpContext) {
    const { success } = request.only(['success'])
    const userId = Number.parseInt(params.userId)

    const { progress, newStatus } = await this.service.answer(
      userId,
      Number.parseInt(params.cardId),
      success
    )

    let unlockedAchievements: any[] = []

    if (newStatus) {
      const unlocked = await this.achievementService.processEvent({
        type: 'card_status_changed',
        userId: userId,
        status: newStatus,
      })
      unlockedAchievements.push(...unlocked)
    }

    if (success && progress.currentStreak > 0) {
      const unlocked = await this.achievementService.processEvent({
        type: 'streak_reached',
        userId: userId,
        streak: progress.currentStreak,
      })
      unlockedAchievements.push(...unlocked)
    }

    if (success) {
      const unlocked = await this.achievementService.processEvent({
        type: 'total_correct',
        userId: userId,
        count: progress.successCount,
      })
      unlockedAchievements.push(...unlocked)
    }

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
        }
      })
    )

    const uniqueAchievements = unlockedDetails.filter(
      (achievement, index, self) => index === self.findIndex((a) => a.id === achievement.id)
    )

    return response.ok({
      progress,
      unlockedAchievements: uniqueAchievements,
    })
  }

  async byDeck({ params, response }: HttpContext) {
    const progress = await this.service.byDeck(params.userId, params.deckId)
    return response.ok(progress)
  }
}
