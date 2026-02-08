import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type StatsGridProps = {
  correct: number;
  incorrect: number;
  totalCards: number;
  bestStreak: number;
};

export default function StatsGrid({
  correct,
  incorrect,
  totalCards,
  bestStreak,
}: StatsGridProps) {
  const { t } = useTranslation();

  const stats = [
    {
      icon: "checkmark-circle",
      iconColor: "#10b981",
      bgColor: "#dcfce7",
      value: correct,
      label: t("trainComplete.stats.correct"),
    },
    {
      icon: "close-circle",
      iconColor: "#ef4444",
      bgColor: "#fee2e2",
      value: incorrect,
      label: t("trainComplete.stats.incorrect"),
    },
    {
      icon: "albums",
      iconColor: "#3b82f6",
      bgColor: "#dbeafe",
      value: totalCards,
      label: t("trainComplete.stats.totalCards"),
    },
    {
      icon: "flash",
      iconColor: "#f59e0b",
      bgColor: "#fef3c7",
      value: bestStreak,
      label: t("trainComplete.stats.bestStreak"),
    },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.card}>
          <View style={[styles.icon, { backgroundColor: stat.bgColor }]}>
            <Ionicons
              name={stat.icon as any}
              size={28}
              color={stat.iconColor}
            />
          </View>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
});
