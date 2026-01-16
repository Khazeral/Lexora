import User from '../../backend/app/models/user.js'

export default class UserSeeder {
  async run() {
    await User.create({
      username: 'player_one',
      email: 'player@lexup.app',
    })
  }
}
