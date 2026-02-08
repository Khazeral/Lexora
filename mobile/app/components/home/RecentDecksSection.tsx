import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type Deck = {
  id: number;
  name: string;
  cardCount: number;
};

type RecentDecksSectionProps = {
  decks: Deck[];
  isLoading?: boolean;
};

export default function RecentDecksSection({
  decks,
  isLoading,
}: RecentDecksSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : decks.length > 0 ? (
        decks.map((deck) => <DeckCard key={deck.id} deck={deck} />)
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const SectionHeader = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{t("home.recentDecks.title")}</Text>
      <TouchableOpacity onPress={() => router.push("/(tabs)/deck")}>
        <Text style={styles.seeAll}>{t("home.recentDecks.seeAll")}</Text>
      </TouchableOpacity>
    </View>
  );
};

type DeckCardProps = {
  deck: Deck;
};

const DeckCard = ({ deck }: DeckCardProps) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.deckCard}
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.deckIcon}>
        <Ionicons name="albums" size={24} color="#3b82f6" />
      </View>
      <View style={styles.deckInfo}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deck.name}
        </Text>
        <Text style={styles.deckCards}>
          {t("home.recentDecks.cards", { count: deck.cardCount })}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
    </TouchableOpacity>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyState}>
      <Ionicons name="albums-outline" size={48} color="#cbd5e1" />
      <Text style={styles.emptyText}>{t("home.recentDecks.noDecks")}</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>
          {t("home.recentDecks.createFirst")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  seeAll: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
  deckCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deckIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  deckCards: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 12,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
