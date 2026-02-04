import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class IndexSeeder extends BaseSeeder {
  private async seed(seederModule: any) {
    const SeederClass = seederModule.default as typeof BaseSeeder & {
      environment?: string[]
    }

    const environments = SeederClass.environment

    if (
      environments &&
      ((!environments.includes('development') && app.inDev) ||
        (!environments.includes('testing') && app.inTest) ||
        (!environments.includes('production') && app.inProduction))
    ) {
      return
    }

    await new SeederClass(this.client).run()
  }

  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/deck_seeder'))
    await this.seed(await import('#database/seeders/card_seeder'))
    await this.seed(await import('#database/seeders/card_progress_seeder'))
    await this.seed(await import('#database/seeders/achievement_seeder'))
  }
}
