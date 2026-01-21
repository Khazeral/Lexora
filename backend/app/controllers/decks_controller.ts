import type { HttpContext } from '@adonisjs/core/http'
import DecksService from '#services/deck_service'

export default class DecksController {
  private decksService = new DecksService()

  async index({ auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    const decks = await this.decksService.listForUser(userId)
    return response.ok(decks)
  }

  async show({ params, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    const deck = await this.decksService.getDeckForTraining(params.id, userId)
    if (!deck) return response.notFound({ message: 'Deck not found' })

    return response.ok(deck)
  }

  async create({ request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    const { name } = request.only(['name'])
    const deck = await this.decksService.create({ name, userId })
    return response.created(deck)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    const data = request.only(['name', 'description'])
    const deck = await this.decksService.update(params.id, userId, data)
    if (!deck) return response.notFound({ message: 'Deck not found' })

    return response.ok(deck)
  }

  async delete({ params, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    await this.decksService.delete(params.id, userId)
    return response.noContent()
  }

  async training({ params, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    const deck = await this.decksService.getDeckForTraining(params.deckId, userId)
    if (!deck) return response.notFound({ message: 'Deck not found' })

    return response.ok(deck)
  }

  async home({ auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) return response.unauthorized({ message: 'Not logged in' })

    const homeData = await this.decksService.getHomeData(userId)
    return response.ok(homeData)
  }
}
