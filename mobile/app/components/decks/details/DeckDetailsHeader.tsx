import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type DeckDetailHeaderProps = {
  name: string;
  cardCount: number;
  onBack: () => void;
};

export default function DeckDetailHeader({
  name,
  cardCount,
  onBack,
}: DeckDetailHeaderProps) {
  const { t } = useTranslation();

  const cardCountText =
    cardCount === 1
      ? t("decks.deckDetail.cards", { count: cardCount })
      : t("decks.deckDetail.cards_plural", { count: cardCount });

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#1e293b" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.cardCount}>{cardCountText}</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  placeholder: {
    width: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  cardCount: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
});
