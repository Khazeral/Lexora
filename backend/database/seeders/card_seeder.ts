import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Card from '#models/card'
import Deck from '#models/deck'

export default class CardSeeder extends BaseSeeder {
  async run() {
    const animaux = await Deck.findByOrFail('name', 'Animaux')

    await Card.createMany([
      { word: 'dog', translation: 'chien', deckId: animaux.id },
      { word: 'cat', translation: 'chat', deckId: animaux.id },
      { word: 'bird', translation: 'oiseau', deckId: animaux.id },
      { word: 'cow', translation: 'vache', deckId: animaux.id },
      { word: 'horse', translation: 'cheval', deckId: animaux.id },
      { word: 'pig', translation: 'cochon', deckId: animaux.id },
      { word: 'sheep', translation: 'mouton', deckId: animaux.id },
      { word: 'goat', translation: 'chèvre', deckId: animaux.id },
      { word: 'chicken', translation: 'poulet', deckId: animaux.id },
    ])

    await Card.createMany([
      { word: 'lion', translation: 'lion', deckId: animaux.id },
      { word: 'tiger', translation: 'tigre', deckId: animaux.id },
      { word: 'elephant', translation: 'éléphant', deckId: animaux.id },
      { word: 'monkey', translation: 'singe', deckId: animaux.id },
      { word: 'snake', translation: 'serpent', deckId: animaux.id },
      { word: 'frog', translation: 'grenouille', deckId: animaux.id },
      { word: 'fish', translation: 'poisson', deckId: animaux.id },
      { word: 'whale', translation: 'baleine', deckId: animaux.id },
      { word: 'shark', translation: 'requin', deckId: animaux.id },
    ])
  }
}
