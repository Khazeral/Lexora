import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { getCardLevel } from "@/constants/cardLevels";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type Card = {
  id: number;
  progress?: {
    status?: string;
  };
};

type DeckStatsProps = {
  cards: Card[];
};

export default function DeckStats({ cards }: DeckStatsProps) {
  const { t } = useTranslation();

  const masteredCount = cards.filter((card) => {
    const level = getCardLevel(card.progress?.status);
    return level === "gold" || level === "platinum";
  }).length;

  const toReviewCount = cards.filter((card) => {
    const level = getCardLevel(card.progress?.status);
    return level === "bronze" || level === "silver";
  }).length;

  const masteryPercentage = cards.length
    ? Math.round((masteredCount / cards.length) * 100)
    : 0;

  return (
    <View className="flex-row px-6 py-4 gap-3">
      <View
        className="flex-1 bg-card rounded-2xl p-4 items-center border-2 border-border"
        style={pillShadow.sm}
      >
        <View
          className="w-12 h-12 rounded-xl bg-accent items-center justify-center mb-2"
          style={pillShadow.sm}
        >
          <Ionicons name="trophy" size={24} color="#0b3d2e" />
        </View>
        <Text className="text-foreground text-2xl font-bold">
          {masteryPercentage}%
        </Text>
        <Text className="text-muted-foreground text-xs font-bold tracking-wider mt-1">
          {t("decks.deckDetail.stats.mastery").toUpperCase()}
        </Text>
      </View>

      <View
        className="flex-1 bg-card rounded-2xl p-4 items-center border-2 border-border"
        style={pillShadow.sm}
      >
        <View
          className="w-12 h-12 rounded-xl bg-info items-center justify-center mb-2"
          style={pillShadow.sm}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </View>
        <Text className="text-foreground text-2xl font-bold">
          {toReviewCount}
        </Text>
        <Text className="text-muted-foreground text-xs font-bold tracking-wider mt-1">
          {t("decks.deckDetail.stats.toReview").toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
