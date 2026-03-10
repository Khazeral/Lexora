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
    color: "#5b8af5",
    bgColor: "#1a3a5c",
    difficulty: "train.trainSettings.difficulty.easy",
    difficultyColor: "#44d9a0",
  },
  {
    id: "speedrun",
    title: "train.trainSettings.gameModes.speedrun.title",
    description: "train.trainSettings.gameModes.speedrun.description",
    icon: "flash",
    color: "#e8453c",
    bgColor: "#3d1a1a",
    difficulty: "train.trainSettings.difficulty.medium",
    difficultyColor: "#f5c542",
  },
  {
    id: "streak",
    title: "train.trainSettings.gameModes.streak.title",
    description: "train.trainSettings.gameModes.streak.description",
    icon: "flame",
    color: "#06b6d4",
    bgColor: "#0d3a3a",
    difficulty: "train.trainSettings.difficulty.hard",
    difficultyColor: "#e8453c",
  },
  {
    id: "timeattack",
    title: "train.trainSettings.gameModes.timeattack.title",
    description: "train.trainSettings.gameModes.timeattack.description",
    icon: "timer",
    color: "#a855f7",
    bgColor: "#2e1a3d",
    difficulty: "train.trainSettings.difficulty.hard",
    difficultyColor: "#e8453c",
  },
  {
    id: "perfect",
    title: "train.trainSettings.gameModes.perfect.title",
    description: "train.trainSettings.gameModes.perfect.description",
    icon: "diamond",
    color: "#f5c542",
    bgColor: "#3d2e1a",
    difficulty: "train.trainSettings.difficulty.expert",
    difficultyColor: "#a855f7",
  },
];
