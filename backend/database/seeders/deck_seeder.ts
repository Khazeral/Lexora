import Deck from '#models/deck'
import User from '#models/user'

export default class DeckSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'player@lexup.app')

    await Deck.createMany([
      { name: 'Animaux', userId: user.id },
      { name: 'Voyage', userId: user.id },
      { name: 'Programmation', userId: user.id },
    ])
  }
}
