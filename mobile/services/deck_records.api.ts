import { fetchAPI } from "./api";

export interface DeckRecord {
  id: number;
  userId: number;
  deckId: number;
  bestSpeedRunTime: number | null;
  speedRunAttempts: number;
  bestStreak: number;
  streakMasterAttempts: number;
  bestAvgTimePerCard: number | null;
  timeAttackAttempts: number;
  perfectRunsCompleted: number;
  perfectRunAttempts: number;
  totalSessions: number;
  lastPlayedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UnlockedAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UpdateDeckRecordsResponse extends DeckRecord {
  unlockedAchievements: UnlockedAchievement[];
}

export interface UpdateRecordPayload {
  gameMode: "classic" | "speedrun" | "streak" | "timeattack" | "perfect";
  speedRunTime?: number;
  timePenalty?: number;
  streak?: number;
  avgTimePerCard?: number;
  isPerfect?: boolean;
  totalCards?: number;
}

export async function getDeckRecords(
  deckId: number,
): Promise<DeckRecord | null> {
  try {
    return await fetchAPI(`/decks/${deckId}/records`, {
      method: "GET",
    });
  } catch (error: any) {
    if (
      error.message?.includes("404") ||
      error.message?.includes("No records found")
    ) {
      return null;
    }
    throw error;
  }
}

export async function updateDeckRecords(
  deckId: number,
  data: {
    gameMode: string;
    speedRunTime?: number;
    timePenalty?: number;
    streak?: number;
    avgTimePerCard?: number;
    totalCards?: number;
    isPerfect?: boolean;
  },
): Promise<UpdateDeckRecordsResponse> {
  return fetchAPI(`/decks/${deckId}/records`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getUserRecords(userId: number): Promise<DeckRecord[]> {
  const data = await fetchAPI(`/users/${userId}/records`);
  return data;
}

export async function getDeckLeaderboard(
  deckId: number,
  gameMode: string,
  limit: number = 10,
): Promise<DeckRecord[]> {
  const data = await fetchAPI(
    `/decks/${deckId}/leaderboard/${gameMode}?limit=${limit}`,
  );
  return data;
}

export async function deleteDeckRecords(deckId: number): Promise<void> {
  await fetchAPI(`/decks/${deckId}/records`, {
    method: "DELETE",
  });
}
