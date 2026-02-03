import { fetchAPI } from "./api";

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: "cards" | "training" | "streaks" | "collection";
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  isSecret: boolean;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  totalXp: number;
  byCategory: {
    cards: Achievement[];
    training: Achievement[];
    streaks: Achievement[];
    collection: Achievement[];
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

export async function getAchievementStats(): Promise<AchievementStats> {
  return fetchAPI("/achievements/stats", { method: "GET" });
}
