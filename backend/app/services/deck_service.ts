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
      .preload('cards', (cardsQuery) => {
        cardsQuery.preload('progress', (progressQuery) => {
          progressQuery.where('user_id', userId)
        })
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
        progress: card.progress[0] || null,
      })),
    }
  }

  async create(payload: { name: string; userId: number }) {
    const deck = await Deck.create({
      name: payload.name,
      userId: payload.userId,
    })

    return {
      id: deck.id,
      name: deck.name,
      cardCount: 0,
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

    let lastPlayedDeck = null
    try {
      const { default: DeckRecord } = await import('#models/deck_record')
      const lastRecord = await DeckRecord.query()
        .where('user_id', userId)
        .orderBy('updated_at', 'desc')
        .first()

      if (lastRecord) {
        const deck = decks.find((d) => d.id === lastRecord.deckId)
        if (deck && deck.cards.length > 0) {
          lastPlayedDeck = {
            id: deck.id,
            name: deck.name,
            cardCount: deck.cards.length,
          }
        }
      }
    } catch (error) {}

    return {
      totalDecks: decks.length,
      totalCards,
      recentDecks,
      lastPlayedDeck,
    }
  }
}
