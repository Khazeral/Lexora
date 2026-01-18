import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder {
  async run() {
    await User.create({
      username: 'player_one',
      email: 'player@lexup.app',
      password: await hash.make('password123'),
    })
  }
}
