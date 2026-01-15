import Deck from '#models/deck'
import Card from '#models/card'

export default class CardSeeder {
  async run() {
    const animaux = await Deck.findByOrFail('name', 'Animaux')

    await Card.createMany([
      { word: 'dog', translation: 'chien', deckId: animaux.id },
      { word: 'cat', translation: 'chat', deckId: animaux.id },
      { word: 'bird', translation: 'oiseau', deckId: animaux.id },
      { word: 'cow', translation: 'vache', deckId: animaux.id },
    ])
  }
}
