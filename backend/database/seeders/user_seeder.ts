import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'player_one',
        email: 'player@lexup.app',
        password: 'password123',
        currentStreak: 0,
        bestStreak: 0,
      },
      {
        username: 'demo',
        email: 'demo@lexup.app',
        password: 'demo1234',
        currentStreak: 0,
        bestStreak: 0,
      },
    ])
  }
}
