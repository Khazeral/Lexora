import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { deckColors, pillShadow, pillColors } from "../ui/GlowStyles";

type Deck = {
  id: number;
  name: string;
  cardCount: number;
};

type DeckCardProps = {
  deck: Deck;
  index: number;
};

type RecentDecksSectionProps = {
  decks: Deck[];
};

export default function RecentDecksSection({ decks }: RecentDecksSectionProps) {
  const { t } = useTranslation();
  const totalCards = decks.reduce((sum, d) => sum + d.cardCount, 0);

  return (
    <View className="mt-8 px-6">
      {/* Section header */}
      <Text className="text-xs text-muted-foreground font-bold tracking-[3px] mb-4">
        CATEGORIES
      </Text>

      {/* All decks card (always shown first) */}
      <AllDecksCard totalCards={totalCards} />

      {/* Individual deck cards */}
      {decks.length > 0 ? (
        decks
          .slice(0, 5)
          .map((deck, index) => (
            <DeckCard key={deck.id} deck={deck} index={index} />
          ))
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

function AllDecksCard({ totalCards }: { totalCards: number }) {
  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border mb-5"
      style={pillShadow.card}
      onPress={() => router.push("/(tabs)/deck")}
      activeOpacity={0.7}
    >
      {/* Icon - Red (primary) */}
      <View
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={[{ backgroundColor: "#e8453c" }, pillShadow.sm]}
      >
        <Ionicons name="book" size={26} color="#fff" />
      </View>

      {/* Info */}
      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-base">
          ALL CATEGORIES
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          {totalCards} cards
        </Text>
      </View>

      {/* Count badge - Dark/black */}
      <View
        className="rounded-full px-4 py-2"
        style={{ backgroundColor: "#0a1f18" }}
      >
        <Text className="text-muted-foreground text-base font-bold">
          {totalCards}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function DeckCard({ deck, index }: DeckCardProps) {
  const colorConfig = deckColors[index % deckColors.length];

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border mb-5"
      style={pillShadow.card}
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={[{ backgroundColor: colorConfig.bg }, pillShadow.sm]}
      >
        <Ionicons name="chatbubble-outline" size={26} color="#fff" />
      </View>

      {/* Info */}
      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-base uppercase">
          {deck.name}
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          {deck.cardCount} cards
        </Text>
      </View>

      {/* Count badge - Dark/black */}
      <View
        className="rounded-full px-4 py-2"
        style={{ backgroundColor: "#0a1f18" }}
      >
        <Text className="text-muted-foreground text-base font-bold">
          {deck.cardCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View className="items-center py-10 rounded-2xl bg-card border-2 border-border">
      <View className="w-16 h-16 rounded-2xl bg-secondary items-center justify-center mb-4">
        <Ionicons name="albums-outline" size={32} color="#6e9e8a" />
      </View>
      <Text className="text-foreground text-base font-bold mb-1">
        {t("home.recentDecks.noDecksTitle")}
      </Text>
      <Text className="text-muted-foreground text-sm mb-5">
        {t("home.recentDecks.noDecksSubtitle")}
      </Text>
      <TouchableOpacity
        className="flex-row items-center gap-2 px-6 py-3 rounded-full"
        style={[{ backgroundColor: "#5b8af5" }, pillShadow.default]}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text className="text-white font-black tracking-wider">
          {t("home.recentDecks.createFirst")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
