import Deck from '#models/deck'

export default class DeckSeeder {
  async run() {
    await Deck.createMany([{ name: 'Animaux' }, { name: 'Voyage' }, { name: 'Programmation' }])
  }
}
