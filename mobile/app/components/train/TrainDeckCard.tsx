import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Deck } from "@/types";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type TrainDeckCardProps = {
  deck: Deck;
};

export default function TrainDeckCard({ deck }: TrainDeckCardProps) {
  const { t } = useTranslation();
  const hasCards = deck.cardCount > 0;

  const cardCountText =
    deck.cardCount === 1
      ? t("train.deck.cards", { count: deck.cardCount })
      : t("train.deck.cards_plural", { count: deck.cardCount });

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 rounded-2xl border-2 ${
        hasCards
          ? "bg-card border-border"
          : "bg-secondary border-border opacity-60"
      }`}
      style={hasCards ? pillShadow.card : undefined}
      disabled={!hasCards}
      onPress={() => router.push(`/train/${deck.id}/settings`)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className={`w-14 h-14 rounded-xl items-center justify-center mr-4 ${
          hasCards ? "bg-info" : "bg-muted"
        }`}
        style={hasCards ? pillShadow.sm : undefined}
      >
        <Ionicons
          name="albums"
          size={26}
          color={hasCards ? "#fff" : "#4a7a6a"}
        />
      </View>

      {/* Content */}
      <View className="flex-1 gap-1">
        <Text
          className={`text-base font-bold tracking-wider ${
            hasCards ? "text-foreground" : "text-muted-foreground"
          }`}
          numberOfLines={1}
        >
          {deck.name.toUpperCase()}
        </Text>

        <View className="flex-row items-center gap-2">
          <Ionicons
            name="card-outline"
            size={14}
            color={hasCards ? "#6e9e8a" : "#4a7a6a"}
          />
          <Text className="text-muted-foreground text-sm">
            {hasCards ? cardCountText : t("train.deck.noCards")}
          </Text>
        </View>
      </View>

      {/* Arrow */}
      {hasCards && (
        <View
          className="w-10 h-10 rounded-xl bg-success items-center justify-center"
          style={pillShadow.sm}
        >
          <Ionicons name="play" size={18} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}
