import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { deckColors, pillShadow } from "../ui/GlowStyles";
import AnimatedTouchable from "../ui/AnimatedTouchable";

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
  return (
    <View className="mt-8 px-6">
      <Text className="text-sm text-white font-semibold tracking-[3px] mb-4">
        {t("home.recentDecks.title").toUpperCase()}
      </Text>

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

function DeckCard({ deck, index }: DeckCardProps) {
  const { t } = useTranslation();
  const colorConfig = deckColors[index % deckColors.length];

  return (
    <AnimatedTouchable
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border mb-5"
      style={pillShadow.card}
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      <View
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={[{ backgroundColor: colorConfig.bg }]}
      >
        <Ionicons name="chatbubble-outline" size={26} color="#fff" />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-base uppercase">
          {deck.name}
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          {deck.cardCount <= 1
            ? t("decks.card.cards", { count: deck.cardCount })
            : t("decks.card.cards_plural", { count: deck.cardCount })}
        </Text>
      </View>
    </AnimatedTouchable>
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
