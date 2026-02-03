import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CARD_LEVELS, getCardLevel } from "@/constants/cardLevels";

type Card = {
  id: number;
  word: string;
  translation: string;
  progress?: {
    status?: string;
  };
};

type CardItemProps = {
  card: Card;
  onPress: () => void;
};

export default function CardItem({ card, onPress }: CardItemProps) {
  const { t } = useTranslation();
  const level = getCardLevel(card.progress?.status);
  const levelConfig = CARD_LEVELS[level];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.textContent}>
          <Text style={styles.word} numberOfLines={1}>
            {card.word}
          </Text>
          <Text style={styles.translation} numberOfLines={1}>
            {card.translation}
          </Text>
        </View>

        <View
          style={[styles.levelBadge, { backgroundColor: levelConfig.bgColor }]}
        >
          <Ionicons
            name={levelConfig.icon}
            size={16}
            color={levelConfig.color}
          />
          <Text style={[styles.levelText, { color: levelConfig.color }]}>
            {t(`decks.deckDetail.levels.${levelConfig.label}`)}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardContent: {
    flex: 1,
    gap: 10,
  },
  textContent: {
    gap: 4,
  },
  word: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
  },
  translation: {
    fontSize: 15,
    color: "#64748b",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  levelText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
