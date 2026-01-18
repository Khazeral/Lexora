import Deck from '#models/deck'

export default class DecksService {
  async create(payload: { name: string; description?: string }) {
    const existing = await Deck.query().where('name', payload.name).first()
    if (existing) {
      throw new Error('Deck name already in use')
    }
    return Deck.create(payload)
  }

  async findById(id: number) {
    return Deck.find(id)
  }

  async update(id: number, payload: { name?: string; description?: string }) {
    const deck = await Deck.findOrFail(id)
    if (payload.name) {
      const existing = await Deck.query().where('name', payload.name).whereNot('id', id).first()
      if (existing) {
        throw new Error('Deck name already in use')
      }
    }
    deck.merge(payload)
    await deck.save()
    return deck
  }

  async delete(id: number) {
    const deck = await Deck.findOrFail(id)
    await deck.delete()
  }

  async list() {
    return Deck.all()
  }
}
