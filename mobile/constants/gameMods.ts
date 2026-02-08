export type GameMode =
  | "classic"
  | "speedrun"
  | "streak"
  | "timeattack"
  | "perfect";

export interface ModeConfig {
  id: GameMode;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  difficulty: string;
  difficultyColor: string;
}

export const GAME_MODES: ModeConfig[] = [
  {
    id: "classic",
    title: "train.trainSettings.gameModes.classic.title",
    description: "train.trainSettings.gameModes.classic.description",
    icon: "albums",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    difficulty: "train.trainSettings.difficulty.easy",
    difficultyColor: "#10b981",
  },
  {
    id: "speedrun",
    title: "train.trainSettings.gameModes.speedrun.title",
    description: "train.trainSettings.gameModes.speedrun.description",
    icon: "flash",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    difficulty: "train.trainSettings.difficulty.medium",
    difficultyColor: "#f59e0b",
  },
  {
    id: "streak",
    title: "train.trainSettings.gameModes.streak.title",
    description: "train.trainSettings.gameModes.streak.description",
    icon: "flame",
    color: "#ef4444",
    bgColor: "#fee2e2",
    difficulty: "train.trainSettings.difficulty.hard",
    difficultyColor: "#ef4444",
  },
  {
    id: "timeattack",
    title: "train.trainSettings.gameModes.timeattack.title",
    description: "train.trainSettings.gameModes.timeattack.description",
    icon: "timer",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
    difficulty: "train.trainSettings.difficulty.hard",
    difficultyColor: "#ef4444",
  },
  {
    id: "perfect",
    title: "train.trainSettings.gameModes.perfect.title",
    description: "train.trainSettings.gameModes.perfect.description",
    icon: "diamond",
    color: "#ec4899",
    bgColor: "#fce7f3",
    difficulty: "train.trainSettings.difficulty.expert",
    difficultyColor: "#7c3aed",
  },
];
