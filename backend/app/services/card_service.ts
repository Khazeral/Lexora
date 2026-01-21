import Card from '#models/card'

export default class CardsService {
  async listByDeck(deckId: number) {
    return Card.query().where('deck_id', deckId).preload('progress')
  }

  async findById(id: number) {
    const card = await Card.query().where('id', id).preload('progress').first()

    if (!card) return null

    return {
      id: card.id,
      word: card.word,
      translation: card.translation,
      deckId: card.deckId,
      progress: card.progress.map((p) => ({
        userId: p.userId,
        successCount: p.successCount,
        failureCount: p.failureCount,
        currentStreak: p.currentStreak,
        maxStreak: p.maxStreak,
        status: p.status,
      })),
    }
  }

  async create(payload: { word: string; translation: string; deckId: number }) {
    return Card.create(payload)
  }

  async update(id: number, payload: Partial<{ word: string; translation: string }>) {
    const card = await Card.findOrFail(id)
    card.merge(payload)
    await card.save()
    return card
  }

  async delete(id: number) {
    const card = await Card.findOrFail(id)
    await card.delete()
  }
}
