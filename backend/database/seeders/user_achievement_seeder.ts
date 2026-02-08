import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Achievement from '#models/achievement'
import UserAchievement from '#models/user_achievement'
import { DateTime } from 'luxon'

export default class UserAchievementSeeder extends BaseSeeder {
  async run() {
    const user = await User.query().first()

    if (!user) {
      console.log('No user found, skipping user achievement seeder')
      return
    }

    const achievements = await Achievement.all()

    if (achievements.length === 0) {
      console.log('No achievements found, skipping user achievement seeder')
      return
    }

    const seenAchievementCodes = ['first_card', 'first_deck', 'first_training']

    const unseenAchievementCodes = ['card_collector_10', 'training_10', 'first_silver']

    for (const code of seenAchievementCodes) {
      const achievement = achievements.find((a) => a.code === code)
      if (achievement) {
        await UserAchievement.firstOrCreate(
          {
            userId: user.id,
            achievementId: achievement.id,
          },
          {
            userId: user.id,
            achievementId: achievement.id,
            progress: achievement.conditions.target,
            target: achievement.conditions.target,
            unlocked: true,
            unlockedAt: DateTime.now().minus({ days: 3 }),
            seen: true,
          }
        )
      }
    }

    for (const code of unseenAchievementCodes) {
      const achievement = achievements.find((a) => a.code === code)
      if (achievement) {
        await UserAchievement.firstOrCreate(
          {
            userId: user.id,
            achievementId: achievement.id,
          },
          {
            userId: user.id,
            achievementId: achievement.id,
            progress: achievement.conditions.target,
            target: achievement.conditions.target,
            unlocked: true,
            unlockedAt: DateTime.now().minus({ minutes: 30 }),
            seen: false,
          }
        )
      }
    }

    console.log(`Created ${seenAchievementCodes.length} seen achievements`)
    console.log(`Created ${unseenAchievementCodes.length} unseen achievements (NEW)`)
  }
}
