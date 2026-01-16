import type { HttpContext } from '@adonisjs/core/http'
import { createDeckValidator, updateDeckValidator } from '#validators/deck'
import DecksService from '#services/deck_service'

export default class DecksController {
  private decksService = new DecksService()

  async index({ response }: HttpContext) {
    const decks = await this.decksService.list()
    return response.ok(decks)
  }

  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createDeckValidator)
    try {
      const deck = await this.decksService.create(payload)
      return response.created(deck)
    } catch (error) {
      return response.status(422).send({ message: error.message })
    }
  }

  async show({ params, response }: HttpContext) {
    const deck = await this.decksService.findById(params.id)
    if (!deck) {
      return response.notFound({ message: 'Deck not found' })
    }
    return response.ok(deck)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateDeckValidator)
    try {
      const deck = await this.decksService.update(params.id, payload)
      return response.ok(deck)
    } catch (error) {
      return response.status(422).send({ message: error.message })
    }
  }

  async delete({ params, response }: HttpContext) {
    await this.decksService.delete(params.id)
    return response.noContent()
  }
}
