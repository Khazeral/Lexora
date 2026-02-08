import DeckRecord from '#models/deck_record'
import { DateTime } from 'luxon'

interface UpdateRecordData {
  userId: number
  deckId: number
  gameMode: 'classic' | 'speedrun' | 'streak' | 'timeattack' | 'perfect'
  speedRunTime?: number
  timePenalty?: number
  streak?: number
  avgTimePerCard?: number
  isPerfect?: boolean
  totalCards?: number
}

export default class DeckRecordsService {
  async getOrCreateRecord(userId: number, deckId: number): Promise<DeckRecord> {
    let record = await DeckRecord.query().where('user_id', userId).where('deck_id', deckId).first()

    if (!record) {
      record = await DeckRecord.create({
        userId,
        deckId,
        speedRunAttempts: 0,
        streakMasterAttempts: 0,
        timeAttackAttempts: 0,
        perfectRunAttempts: 0,
        perfectRunsCompleted: 0,
        bestStreak: 0,
        totalSessions: 0,
      })
    }

    return record
  }

  async updateRecord(data: UpdateRecordData): Promise<DeckRecord> {
    const record = await this.getOrCreateRecord(data.userId, data.deckId)

    record.totalSessions += 1
    record.lastPlayedAt = DateTime.now()

    switch (data.gameMode) {
      case 'speedrun':
        await this.updateSpeedRunRecord(record, data)
        break

      case 'streak':
        await this.updateStreakMasterRecord(record, data)
        break

      case 'timeattack':
        await this.updateTimeAttackRecord(record, data)
        break

      case 'perfect':
        await this.updatePerfectRunRecord(record, data)
        break

      case 'classic':
        break
    }

    await record.save()
    return record
  }

  private async updateSpeedRunRecord(record: DeckRecord, data: UpdateRecordData): Promise<void> {
    record.speedRunAttempts += 1

    if (data.speedRunTime !== undefined) {
      const finalTime = data.speedRunTime + (data.timePenalty || 0)

      if (record.bestSpeedRunTime === null || finalTime < record.bestSpeedRunTime) {
        record.bestSpeedRunTime = finalTime
      }
    }
  }

  private async updateStreakMasterRecord(
    record: DeckRecord,
    data: UpdateRecordData
  ): Promise<void> {
    record.streakMasterAttempts += 1

    if (data.streak !== undefined && data.streak > record.bestStreak) {
      record.bestStreak = data.streak
    }
  }

  private async updateTimeAttackRecord(record: DeckRecord, data: UpdateRecordData): Promise<void> {
    record.timeAttackAttempts += 1

    if (data.avgTimePerCard !== undefined) {
      if (record.bestAvgTimePerCard === null || data.avgTimePerCard < record.bestAvgTimePerCard) {
        record.bestAvgTimePerCard = data.avgTimePerCard
      }
    }
  }

  private async updatePerfectRunRecord(record: DeckRecord, data: UpdateRecordData): Promise<void> {
    record.perfectRunAttempts += 1

    if (data.isPerfect === true) {
      record.perfectRunsCompleted += 1
    }
  }

  async getRecord(userId: number, deckId: number): Promise<DeckRecord | null> {
    return await DeckRecord.query().where('user_id', userId).where('deck_id', deckId).first()
  }

  async getUserRecords(userId: number): Promise<DeckRecord[]> {
    return await DeckRecord.query()
      .where('user_id', userId)
      .preload('deck')
      .orderBy('last_played_at', 'desc')
  }

  async getDeckLeaderboard(deckId: number, gameMode: string, limit: number = 10) {
    const query = DeckRecord.query().where('deck_id', deckId).preload('user').limit(limit)

    switch (gameMode) {
      case 'speedrun':
        query.whereNotNull('best_speed_run_time').orderBy('best_speed_run_time', 'asc')
        break

      case 'streak':
        query.where('best_streak', '>', 0).orderBy('best_streak', 'desc')
        break

      case 'timeattack':
        query.whereNotNull('best_avg_time_per_card').orderBy('best_avg_time_per_card', 'asc')
        break

      case 'perfect':
        query.where('perfect_runs_completed', '>', 0).orderBy('perfect_runs_completed', 'desc')
        break
    }

    return await query
  }

  async deleteRecord(userId: number, deckId: number): Promise<void> {
    await DeckRecord.query().where('user_id', userId).where('deck_id', deckId).delete()
  }
}
