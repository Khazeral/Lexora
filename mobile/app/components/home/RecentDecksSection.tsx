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
import { LinearGradient } from "expo-linear-gradient";

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
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("home.recentDecks.title")}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/deck")}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAll}>{t("home.recentDecks.seeAll")}</Text>
          <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : decks.length > 0 ? (
        <View style={styles.decksList}>
          {decks.map((deck, index) => (
            <DeckCard key={deck.id} deck={deck} index={index} />
          ))}
        </View>
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

type DeckCardProps = {
  deck: Deck;
  index: number;
};

const deckColors = [
  ["#3b82f6", "#2563eb"],
  ["#8b5cf6", "#7c3aed"],
  ["#ec4899", "#db2777"],
  ["#f59e0b", "#d97706"],
  ["#10b981", "#059669"],
] as const;

const DeckCard = ({ deck, index }: DeckCardProps) => {
  const { t } = useTranslation();
  const colors = deckColors[index % deckColors.length];

  return (
    <TouchableOpacity
      style={styles.deckCard}
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.deckIconGradient}
      >
        <Ionicons name="albums" size={24} color="#fff" />
      </LinearGradient>
      <View style={styles.deckInfo}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deck.name}
        </Text>
        <View style={styles.deckMeta}>
          <Ionicons name="layers-outline" size={14} color="#94a3b8" />
          <Text style={styles.deckCards}>
            {t("home.recentDecks.cards", { count: deck.cardCount })}
          </Text>
        </View>
      </View>
      <View style={styles.playButton}>
        <Ionicons name="play" size={18} color="#3b82f6" />
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="albums-outline" size={48} color="#94a3b8" />
      </View>
      <Text style={styles.emptyTitle}>
        {t("home.recentDecks.noDecksTitle")}
      </Text>
      <Text style={styles.emptyText}>
        {t("home.recentDecks.noDecksSubtitle")}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={20} color="#fff" />
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
    paddingTop: 24,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAll: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
  decksList: {
    gap: 10,
  },
  deckCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deckIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  deckMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deckCards: {
    fontSize: 13,
    color: "#94a3b8",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
