import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type Deck = {
  name: string;
  cards: any[];
};

type DeckInfoCardProps = {
  deck: Deck;
};

export default function DeckInfoCard({ deck }: DeckInfoCardProps) {
  const { t } = useTranslation();

  const cardCountText =
    deck.cards.length === 1
      ? t("train.trainSettings.cards", { count: deck.cards.length })
      : t("train.trainSettings.cards_plural", { count: deck.cards.length });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="albums" size={32} color="#3b82f6" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deck.name}
        </Text>
        <Text style={styles.cards}>{cardCountText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  cards: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
});
