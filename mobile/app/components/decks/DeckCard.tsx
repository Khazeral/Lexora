import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, Href } from "expo-router";
import { useTranslation } from "react-i18next";

type Deck = {
  id: number;
  name: string;
  cardCount: number;
  lastStudied?: string;
};

type DeckCardProps = {
  deck: Deck;
};

export default function DeckCard({ deck }: DeckCardProps) {
  const { t } = useTranslation();

  const cardCountText =
    deck.cardCount === 1
      ? t("decks.card.cards", { count: deck.cardCount })
      : t("decks.card.cards_plural", { count: deck.cardCount });

  return (
    <Link href={`/deck/${deck.id}` as Href} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <Ionicons name="albums" size={24} color="#3b82f6" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {deck.name}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="card-outline" size={14} color="#64748b" />
            <Text style={styles.metaText}>{cardCountText}</Text>
          </View>
          {deck.lastStudied && (
            <View style={styles.meta}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>
                {t("decks.card.lastStudied", { date: deck.lastStudied })}
              </Text>
            </View>
          )}
        </View>

        <Ionicons name="chevron-forward" size={24} color="#cbd5e1" />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
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
});
