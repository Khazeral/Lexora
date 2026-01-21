import CardProgressService from '#services/progress_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProgressController {
  private service = new CardProgressService()

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
    const progress = await this.service.answer(
      Number.parseInt(params.userId),
      Number.parseInt(params.cardId),
      success
    )
    return response.ok(progress)
  }

  async byDeck({ params, response }: HttpContext) {
    const progress = await this.service.byDeck(params.userId, params.deckId)
    return response.ok(progress)
  }
}
