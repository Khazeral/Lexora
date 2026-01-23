import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type StatsSectionProps = {
  totalDecks: number;
  totalCards: number;
  isLoading?: boolean;
};

export default function StatsSection({
  totalDecks,
  totalCards,
  isLoading,
}: StatsSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.statsContainer}>
      <StatCard
        icon="albums"
        iconColor="#3b82f6"
        value={totalDecks}
        label={t("home.stats.totalDecks")}
      />
      <StatCard
        icon="card"
        iconColor="#10b981"
        value={totalCards}
        label={t("home.stats.totalCards")}
      />
    </View>
  );
}

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: number;
  label: string;
};

const StatCard = ({ icon, iconColor, value, label }: StatCardProps) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={32} color={iconColor} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
});
