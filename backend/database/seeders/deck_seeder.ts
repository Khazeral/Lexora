import Deck from '../../backend/app/models/deck.js'

export default class DeckSeeder {
  async run() {
    await Deck.createMany([{ name: 'Animaux' }, { name: 'Voyage' }, { name: 'Programmation' }])
  }
}
