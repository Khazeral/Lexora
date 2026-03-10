import { StyleSheet } from "react-native";

export const glowStyles = StyleSheet.create({
  blue: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  blueSm: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  blueButton: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  gold: {
    shadowColor: "#f5c542",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  green: {
    shadowColor: "#44d9a0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  purple: {
    shadowColor: "#b08dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  pink: {
    shadowColor: "#f472b6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  red: {
    shadowColor: "#e8453c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

export const cardGlow = StyleSheet.create({
  default: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  active: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
});

export const pillShadow = StyleSheet.create({
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 12,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 0,
    elevation: 8,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 10,
  },
});

export const pillColors = {
  blue: "#5b8af5",
  yellow: "#f5c542",
  red: "#e8453c",
  green: "#44d9a0",
  purple: "#b08dff",
  pink: "#f472b6",
  cyan: "#45c8f0",
};

export const deckColors = [
  { bg: "#5b8af5", glow: glowStyles.blue },
  { bg: "#b08dff", glow: glowStyles.purple },
  { bg: "#44d9a0", glow: glowStyles.green },
  { bg: "#f472b6", glow: glowStyles.pink },
  { bg: "#f5c542", glow: glowStyles.gold },
  { bg: "#e8453c", glow: glowStyles.red },
  { bg: "#45c8f0", glow: glowStyles.blue },
];

export const categoryColorMap: Record<string, string> = {
  Salutations: pillColors.blue,
  Nombres: pillColors.purple,
  Nature: pillColors.green,
  Famille: pillColors.pink,
  Temps: pillColors.cyan,
  Nourriture: pillColors.yellow,
  Verbes: pillColors.red,
};
