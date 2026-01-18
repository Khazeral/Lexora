import Card from '#models/card'

export default class CardsService {
  async create(payload: { word: string; translation: string; deckId: number }) {
    return Card.create(payload)
  }

  async findById(id: number) {
    return Card.find(id)
  }

  async update(id: number, payload: { word?: string; translation?: string; deckId?: number }) {
    const card = await Card.findOrFail(id)
    card.merge(payload)
    await card.save()
    return card
  }

  async delete(id: number) {
    const card = await Card.findOrFail(id)
    await card.delete()
  }

  async listByDeck(deckId: number) {
    return Card.query().where('deck_id', deckId)
  }
}
