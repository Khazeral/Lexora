import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";
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
    cardCount <= 1
      ? t("decks.deckDetail.cards", { count: cardCount })
      : t("decks.deckDetail.cards_plural", { count: cardCount });

  return (
    <View className="flex-row items-center justify-between px-6 py-4 ">
      <TouchableOpacity
        onPress={onBack}
        className="w-12 h-12 rounded-xl bg-card border-2 border-border items-center justify-center"
        style={pillShadow.sm}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color="#e8edf5" />
      </TouchableOpacity>

      <View className="flex-1 items-center px-4">
        <Text
          className="text-foreground text-lg font-bold tracking-wider"
          numberOfLines={1}
        >
          {name.toUpperCase()}
        </Text>
        <Text className="text-muted-foreground text-xs mt-1">
          {cardCountText}
        </Text>
      </View>

      <View className="w-12" />
    </View>
  );
}
