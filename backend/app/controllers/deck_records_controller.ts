import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DeckRecordsService from '#services/deck_record_service'

@inject()
export default class DeckRecordsController {
  constructor(private deckRecordsService: DeckRecordsService) {}

  async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Unauthorized' })
      }

      const deckId = params.deckId
      const record = await this.deckRecordsService.getRecord(user.id, deckId)

      if (!record) {
        return response.notFound({ message: 'No records found for this deck' })
      }

      return response.ok(record)
    } catch (error) {
      console.error('Error fetching deck records:', error)
      return response.internalServerError({ message: 'Failed to fetch records' })
    }
  }

  async update({ params, auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Unauthorized' })
      }

      const deckId = params.deckId
      const data = request.only([
        'gameMode',
        'speedRunTime',
        'timePenalty',
        'streak',
        'avgTimePerCard',
        'isPerfect',
        'totalCards',
      ])

      if (!data.gameMode) {
        return response.badRequest({ message: 'gameMode is required' })
      }

      const validModes = ['classic', 'speedrun', 'streak', 'timeattack', 'perfect']
      if (!validModes.includes(data.gameMode)) {
        return response.badRequest({ message: 'Invalid gameMode' })
      }

      const record = await this.deckRecordsService.updateRecord({
        userId: user.id,
        deckId: deckId,
        gameMode: data.gameMode,
        speedRunTime: data.speedRunTime,
        timePenalty: data.timePenalty,
        streak: data.streak,
        avgTimePerCard: data.avgTimePerCard,
        isPerfect: data.isPerfect,
        totalCards: data.totalCards,
      })

      return response.ok(record)
    } catch (error) {
      console.error('Error updating deck records:', error)
      return response.internalServerError({ message: 'Failed to update records' })
    }
  }

  async userRecords({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Unauthorized' })
      }

      const userId = params.userId
      if (user.id !== Number.parseInt(userId)) {
        return response.forbidden({ message: 'Forbidden' })
      }

      const records = await this.deckRecordsService.getUserRecords(userId)

      return response.ok(records)
    } catch (error) {
      console.error('Error fetching user records:', error)
      return response.internalServerError({ message: 'Failed to fetch records' })
    }
  }

  async leaderboard({ params, response }: HttpContext) {
    try {
      const deckId = params.deckId
      const gameMode = params.gameMode
      const limit = Number.parseInt(params.limit || '10')

      const validModes = ['speedrun', 'streak', 'timeattack', 'perfect']
      if (!validModes.includes(gameMode)) {
        return response.badRequest({ message: 'Invalid gameMode' })
      }

      const leaderboard = await this.deckRecordsService.getDeckLeaderboard(deckId, gameMode, limit)

      return response.ok(leaderboard)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return response.internalServerError({ message: 'Failed to fetch leaderboard' })
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Unauthorized' })
      }

      const deckId = params.deckId

      await this.deckRecordsService.deleteRecord(user.id, deckId)

      return response.ok({ message: 'Records deleted successfully' })
    } catch (error) {
      console.error('Error deleting deck records:', error)
      return response.internalServerError({ message: 'Failed to delete records' })
    }
  }
}
