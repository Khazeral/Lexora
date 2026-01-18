import Card from '#models/card'

export default class CardsService {
  async listByDeck(deckId: number) {
    return Card.query().where('deck_id', deckId).preload('progress')
  }

  async findById(id: number) {
    return Card.query().where('id', id).preload('progress').first()
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
