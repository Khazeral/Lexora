import { fetchAPI } from "./api";

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: "cards" | "training" | "streaks" | "collection";
  rarity: "common" | "rare" | "epic" | "legendary";
  isSecret: boolean;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface UnlockedAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface CheckAchievementResponse {
  checked: boolean;
  unlocked: UnlockedAchievement[];
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  byCategory: {
    cards: { total: number; unlocked: number };
    training: { total: number; unlocked: number };
    streaks: { total: number; unlocked: number };
    collection: { total: number; unlocked: number };
  };
  byRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

export async function getAchievements(): Promise<Achievement[]> {
  return fetchAPI("/achievements", { method: "GET" });
}

export async function checkAchievements(
  eventType: string,
  data?: Record<string, any>,
): Promise<CheckAchievementResponse> {
  return fetchAPI("/achievements/check", {
    method: "POST",
    body: JSON.stringify({ eventType, data }),
  });
}

export async function getAchievementStats(): Promise<AchievementStats> {
  return fetchAPI("/achievements/stats", { method: "GET" });
}
