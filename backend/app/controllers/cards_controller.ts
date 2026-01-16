import type { HttpContext } from '@adonisjs/core/http'
import { createCardValidator, updateCardValidator } from '#validators/card'
import CardsService from '#services/card_service'

export default class CardsController {
  private cardsService = new CardsService()

  async show({ params, response }: HttpContext) {
    const card = await this.cardsService.findById(params.id)
    if (!card) {
      return response.notFound({ message: 'Card not found' })
    }
    return response.ok(card)
  }

  async byDeck({ params, response }: HttpContext) {
    const cards = await this.cardsService.listByDeck(params.deckId)
    return response.ok(cards)
  }

  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCardValidator)
    const card = await this.cardsService.create(payload)
    return response.created(card)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCardValidator)
    const card = await this.cardsService.update(params.id, payload)
    return response.ok(card)
  }

  async delete({ params, response }: HttpContext) {
    await this.cardsService.delete(params.id)
    return response.noContent()
  }
}
