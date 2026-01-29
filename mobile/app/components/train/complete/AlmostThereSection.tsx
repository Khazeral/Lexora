import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type CardUpgrade = {
  id: number;
  word: string;
  translation: string;
  remaining: number;
  nextLevel: {
    name: string;
    icon: string;
    color: string;
  };
  percentToNext: number;
};

type AlmostThereSectionProps = {
  cards: CardUpgrade[];
};

export default function AlmostThereSection({ cards }: AlmostThereSectionProps) {
  const { t } = useTranslation();

  if (cards.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={24} color="#3b82f6" />
        <Text style={styles.title}>{t("trainComplete.almostThere.title")}</Text>
      </View>

      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={styles.card}
          onPress={() => router.push(`/card/${card.id}`)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.word} numberOfLines={1}>
                {card.word}
              </Text>
              <Text style={styles.translation} numberOfLines={1}>
                {card.translation}
              </Text>
            </View>
            <View style={styles.remaining}>
              <Ionicons
                name={card.nextLevel.icon as any}
                size={16}
                color={card.nextLevel.color}
              />
              <Text style={styles.remainingText}>
                {t("trainComplete.almostThere.more", { count: card.remaining })}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${card.percentToNext}%`,
                    backgroundColor: card.nextLevel.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>→ {card.nextLevel.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  card: {
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  word: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  translation: {
    fontSize: 14,
    color: "#64748b",
  },
  remaining: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
});
