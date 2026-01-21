import User from '#models/user'

export default class UserSeeder {
  async run() {
    await User.create({
      username: 'player_one',
      email: 'player@lexup.app',
      password: 'password123',
    })
  }
}
