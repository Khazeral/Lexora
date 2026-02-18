import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Deck } from "@/types";
import { deckColors, pillShadow } from "../ui/GlowStyles";

type DeckListItemProps = {
  deck: Deck;
  index: number;
};

export default function DeckListItem({ deck, index }: DeckListItemProps) {
  const colorConfig = deckColors[index % deckColors.length];
  const cardCount = deck.cards?.length || 0;

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border"
      style={pillShadow.card}
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={[{ backgroundColor: colorConfig.bg }, pillShadow.sm]}
      >
        <Ionicons name="albums" size={26} color="#fff" />
      </View>

      {/* Info */}
      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-base uppercase">
          {deck.name}
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          {cardCount} {cardCount === 1 ? "card" : "cards"}
        </Text>
      </View>

      {/* Count badge */}
      <View
        className="rounded-full px-4 py-2"
        style={{ backgroundColor: "#0a1f18" }}
      >
        <Text className="text-muted-foreground text-base font-bold">
          {cardCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
