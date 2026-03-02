import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Deck } from "@/types";
import { deckColors, pillShadow } from "../ui/GlowStyles";
import { useTranslation } from "react-i18next";
import AnimatedTouchable from "../ui/AnimatedTouchable";

type DeckListItemProps = {
  deck: Deck;
  index: number;
  onMenuPress?: (deck: Deck) => void;
  isEditing?: boolean;
};

export default function DeckListItem({
  deck,
  index,
  onMenuPress,
  isEditing = false,
}: DeckListItemProps) {
  const colorConfig = deckColors[index % deckColors.length];
  const { t } = useTranslation();

  const hasCards = deck.cardCount > 0;

  return (
    <AnimatedTouchable
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border"
      style={pillShadow.card}
      onPress={() =>
        router.push({ pathname: "/deck/[id]", params: { id: deck.id } })
      }
      activeOpacity={1}
    >
      <View
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={{ backgroundColor: colorConfig.bg }}
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

      <View className="flex-row items-center gap-2">
        {isEditing ? (
          <AnimatedTouchable
            onPress={(e) => {
              e.stopPropagation();
              onMenuPress?.(deck);
            }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5c542",
              borderWidth: 2,
              borderColor: "#ffd966",
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#0b3d2e" />
          </AnimatedTouchable>
        ) : (
          <AnimatedTouchable
            onPress={(e) => {
              e.stopPropagation();
              if (hasCards) {
                router.push(`/train/${deck.id}/settings`);
              }
            }}
            disabled={!hasCards}
            style={[
              {
                width: 42,
                height: 42,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: hasCards ? "#44d9a0" : "#1a5c45",
                borderWidth: 2,
                borderColor: hasCards ? "#6ee8b7" : "#2a7a60",
                opacity: hasCards ? 1 : 0.4,
              },
              hasCards ? pillShadow.sm : undefined,
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="play"
              size={20}
              color={hasCards ? "#0b3d2e" : "#4a7a6a"}
            />
          </AnimatedTouchable>
        )}
      </View>
    </AnimatedTouchable>
  );
}
