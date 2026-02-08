import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createCardValidator, updateCardValidator } from '#validators/card'
import CardsService from '#services/card_service'
import AchievementService from '#services/achievement_service'

@inject()
export default class CardsController {
  constructor(
    private service: CardsService,
    private achievementService: AchievementService
  ) {}

  async byDeck({ params, response }: HttpContext) {
    const cards = await this.service.listByDeck(params.id)
    return response.ok(cards)
  }

  async show({ params, response }: HttpContext) {
    const card = await this.service.findById(params.id)
    if (!card) return response.notFound({ message: 'Card not found' })
    return response.ok(card)
  }

  async create({ request, response, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const payload = await request.validateUsing(createCardValidator)
    const card = await this.service.create(payload)

    const unlockedAchievements = await this.achievementService.processEvent({
      type: 'card_created',
      userId: user.id,
    })

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

    return response.created({
      card,
      unlockedAchievements: unlockedDetails,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCardValidator)
    const card = await this.service.update(params.id, payload)
    return response.ok(card)
  }

  async delete({ params, response }: HttpContext) {
    await this.service.delete(params.id)
    return response.noContent()
  }
}
