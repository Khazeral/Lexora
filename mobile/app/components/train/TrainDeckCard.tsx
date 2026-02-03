import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Deck } from "@/types";

type TrainDeckCardProps = {
  deck: Deck;
};

export default function TrainDeckCard({ deck }: TrainDeckCardProps) {
  const { t } = useTranslation();
  const hasCards = deck.cardCount > 0;

  const cardCountText =
    deck.cardCount === 1
      ? t("train.deck.cards", { count: deck.cardCount })
      : t("train.deck.cards_plural", { count: deck.cardCount });

  return (
    <TouchableOpacity
      style={[styles.card, !hasCards && styles.cardDisabled]}
      disabled={!hasCards}
      onPress={() => router.push(`/train/${deck.id}/settings`)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, !hasCards && styles.iconDisabled]}>
        <Ionicons
          name="albums"
          size={28}
          color={hasCards ? "#3b82f6" : "#94a3b8"}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.name, !hasCards && styles.textDisabled]}
          numberOfLines={1}
        >
          {deck.name}
        </Text>
        <View style={styles.meta}>
          <Ionicons
            name="card-outline"
            size={14}
            color={hasCards ? "#64748b" : "#94a3b8"}
          />
          <Text style={[styles.metaText, !hasCards && styles.textDisabled]}>
            {hasCards ? cardCountText : t("train.deck.noCards")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardDisabled: {
    backgroundColor: "#f8fafc",
    opacity: 0.7,
    borderColor: "#e2e8f0",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconDisabled: {
    backgroundColor: "#f1f5f9",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
  },
  textDisabled: {
    color: "#94a3b8",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#64748b",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
