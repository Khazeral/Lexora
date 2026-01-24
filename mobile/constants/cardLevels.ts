export const CARD_LEVELS = {
  bronze: {
    color: "#cd7f32",
    bgColor: "#fef3e8",
    label: "bronze",
    icon: "medal-outline" as const,
  },
  silver: {
    color: "#c0c0c0",
    bgColor: "#f1f5f9",
    label: "silver",
    icon: "medal-outline" as const,
  },
  gold: {
    color: "#ffd700",
    bgColor: "#fef9e7",
    label: "gold",
    icon: "medal" as const,
  },
  platinum: {
    color: "#e5e4e2",
    bgColor: "#f8fafc",
    label: "platinum",
    icon: "trophy" as const,
  },
} as const;

export type CardLevel = keyof typeof CARD_LEVELS;

export const getCardLevel = (status?: string): CardLevel => {
  if (!status) return "bronze";
  const level = status.toLowerCase();
  return level in CARD_LEVELS ? (level as CardLevel) : "bronze";
};
