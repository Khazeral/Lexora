import Deck from '#models/deck'

export default class DecksService {
  async listForUser(userId: number) {
    const decks = await Deck.query().where('user_id', userId).preload('cards')
    return decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      cardCount: deck.cards.length,
    }))
  }

  async getDeckForTraining(deckId: number, userId: number) {
    const deck = await Deck.query()
      .where('id', deckId)
      .andWhere('user_id', userId)
      .preload('cards', (query) => {
        query.preload('progress', (q) => q.where('user_id', userId))
      })
      .first()

    if (!deck) return null

    return {
      id: deck.id,
      name: deck.name,
      cards: deck.cards.map((card) => ({
        id: card.id,
        word: card.word,
        translation: card.translation,
        progress: card.progress[0] || {
          successCount: 0,
          failureCount: 0,
          currentStreak: 0,
          maxStreak: 0,
          status: 'bronze',
        },
      })),
    }
  }

  async create(payload: { name: string; description?: string; userId: number }) {
    const deck = await Deck.create({
      name: payload.name,
      userId: payload.userId,
    })
    await deck.load('cards')
    return {
      id: deck.id,
      name: deck.name,
      cardCount: deck.cards.length,
    }
  }

  async update(
    deckId: number,
    userId: number,
    payload: Partial<{ name: string; description: string }>
  ) {
    const deck = await Deck.query().where('id', deckId).andWhere('user_id', userId).first()

    if (!deck) return null

    deck.merge(payload)
    await deck.save()

    return {
      id: deck.id,
      name: deck.name,
    }
  }

  async delete(deckId: number, userId: number) {
    const deck = await Deck.query().where('id', deckId).andWhere('user_id', userId).first()

    if (deck) {
      await deck.delete()
    }
  }

  async getHomeData(userId: number) {
    const decks = await Deck.query().where('user_id', userId).preload('cards')

    const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0)
    const recentDecks = decks.slice(-3).map((deck) => ({
      id: deck.id,
      name: deck.name,
      cardCount: deck.cards.length,
    }))

    return {
      totalDecks: decks.length,
      totalCards,
      recentDecks,
    }
  }
}
