import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { getCardLevel } from "@/constants/cardLevels";

type Card = {
  id: number;
  progress?: {
    status?: string;
  };
};

type DeckStatsProps = {
  cards: Card[];
};

export default function DeckStats({ cards }: DeckStatsProps) {
  const { t } = useTranslation();

  const masteredCount = cards.filter((card) => {
    const level = getCardLevel(card.progress?.status);
    return level === "gold" || level === "platinum";
  }).length;

  const toReviewCount = cards.filter((card) => {
    const level = getCardLevel(card.progress?.status);
    return level === "bronze" || level === "silver";
  }).length;

  const masteryPercentage = cards.length
    ? Math.round((masteredCount / cards.length) * 100)
    : 0;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Ionicons name="trophy" size={24} color="#fbbf24" />
        <Text style={styles.statValue}>{masteryPercentage}%</Text>
        <Text style={styles.statLabel}>
          {t("decks.deckDetail.stats.mastery")}
        </Text>
      </View>

      <View style={styles.statCard}>
        <Ionicons name="refresh" size={24} color="#3b82f6" />
        <Text style={styles.statValue}>{toReviewCount}</Text>
        <Text style={styles.statLabel}>
          {t("decks.deckDetail.stats.toReview")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
});
