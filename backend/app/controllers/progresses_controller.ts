import type { HttpContext } from '@adonisjs/core/http'
import ProgressService from '#services/progress_service'
import { answerCardValidator } from '#validators/progress'

export default class ProgressController {
  private progressService = new ProgressService()

  async index({ params, response }: HttpContext) {
    const progresses = await this.progressService.listByUser(params.userId)
    return response.ok(progresses)
  }

  async byDeck({ params, response }: HttpContext) {
    const progresses = await this.progressService.listByUserAndDeck(params.userId, params.deckId)
    return response.ok(progresses)
  }

  async show({ params, response }: HttpContext) {
    const progress = await this.progressService.find(params.userId, params.cardId)
    if (!progress) {
      return response.notFound({ message: 'Progress not found' })
    }
    return response.ok(progress)
  }

  async answer({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(answerCardValidator)
    const result = await this.progressService.answer(params.userId, params.cardId, payload.correct)
    return response.ok(result)
  }
}
