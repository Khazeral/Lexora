import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

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
    <View
      className="bg-card mx-6 my-4 p-4 rounded-2xl flex-row items-center gap-4 border-2 border-border"
      style={pillShadow.card}
    >
      {/* Icon */}
      <View
        className="w-16 h-16 rounded-xl bg-info items-center justify-center"
        style={pillShadow.sm}
      >
        <Ionicons name="albums" size={32} color="#fff" />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text
          className="text-foreground text-lg font-bold tracking-wider"
          numberOfLines={1}
        >
          {deck.name.toUpperCase()}
        </Text>
        <Text className="text-muted-foreground text-sm mt-1">
          {cardCountText}
        </Text>
      </View>
    </View>
  );
}
