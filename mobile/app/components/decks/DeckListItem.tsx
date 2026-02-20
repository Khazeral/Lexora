import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Deck } from "@/types";
import { deckColors, pillShadow } from "../ui/GlowStyles";
import { useTranslation } from "react-i18next";

type DeckListItemProps = {
  deck: Deck;
  index: number;
};

export default function DeckListItem({ deck, index }: DeckListItemProps) {
  const colorConfig = deckColors[index % deckColors.length];
  const cardCount = deck.cards?.length || 0;
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border"
      style={pillShadow.card}
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      <View
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={[{ backgroundColor: colorConfig.bg }]}
      >
        <Ionicons name="albums" size={26} color="#fff" />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-base uppercase">
          {deck.name}
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          {deck.cardCount > 1
            ? t("decks.card.cards_plural", { count: deck.cardCount })
            : t("decks.card.cards", { count: deck.cardCount })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
