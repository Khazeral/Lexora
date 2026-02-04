import { fetchAPI } from "./api";

export interface CardProgress {
  id: number;
  userId: number;
  cardId: number;
  successCount: number;
  failureCount: number;
  currentStreak: number;
  maxStreak: number;
  status: "bronze" | "silver" | "gold" | "platinum" | "ruby";
}

export interface UnlockedAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface AnswerCardResponse {
  progress: CardProgress;
  unlockedAchievements: UnlockedAchievement[];
}

export async function answerCard(
  userId: number,
  cardId: number,
  success: boolean,
): Promise<AnswerCardResponse> {
  return fetchAPI(`/progress/${userId}/${cardId}/answer`, {
    method: "POST",
    body: JSON.stringify({ success }),
  });
}

export async function getCardProgress(userId: number, cardId: number) {
  return fetchAPI(`/progress/${userId}/${cardId}`);
}

export async function getDeckProgress(userId: number, deckId: number) {
  return fetchAPI(`/progress/${userId}/decks/${deckId}`);
}
