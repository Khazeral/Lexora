import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

type QuickStatsProps = {
  totalDecks: number;
  totalCards: number;
  streak: number;
  isLoading?: boolean;
};

export default function QuickStats({
  totalDecks,
  totalCards,
  streak,
  isLoading,
}: QuickStatsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatCard
          icon="albums"
          value={totalDecks}
          label={t("home.stats.decks")}
          colors={["#3b82f6", "#2563eb"]}
        />
        <StatCard
          icon="layers"
          value={totalCards}
          label={t("home.stats.cards")}
          colors={["#10b981", "#059669"]}
        />
        <StatCard
          icon="flame"
          value={streak}
          label={t("home.stats.streak")}
          colors={["#f59e0b", "#d97706"]}
        />
      </View>
    </View>
  );
}

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  colors: readonly [string, string];
};

const StatCard = ({ icon, value, label, colors }: StatCardProps) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={colors}
      style={styles.iconContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Ionicons name={icon} size={20} color="#fff" />
    </LinearGradient>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },
});
