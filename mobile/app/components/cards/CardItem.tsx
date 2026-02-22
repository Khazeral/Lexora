import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CARD_LEVELS, getCardLevel } from "@/constants/cardLevels";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type Card = {
  id: number;
  word: string;
  translation: string;
  progress?: {
    status?: string;
  };
};

type CardItemProps = {
  card: Card;
  onPress: () => void;
};

const LEVEL_COLORS = {
  bronze: { bg: "#cd7f32", text: "#fff", shadow: "#8b4513" },
  silver: { bg: "#c0c0c0", text: "#1a1a1a", shadow: "#808080" },
  gold: { bg: "#f5c542", text: "#1a1a1a", shadow: "#b8860b" },
  platinum: { bg: "#4fc3f7", text: "#0b3d2e", shadow: "#0288d1" },
  new: { bg: "#6e9e8a", text: "#fff", shadow: "#3d5a4a" },
};

export default function CardItem({ card, onPress }: CardItemProps) {
  const { t } = useTranslation();
  const level = getCardLevel(card.progress?.status);
  const levelConfig = CARD_LEVELS[level];
  const colors =
    LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.new;

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-2xl bg-card border-2 border-border"
      style={pillShadow.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
        style={[{ backgroundColor: colors.bg }]}
      >
        <Ionicons name={levelConfig.icon} size={24} color={colors.text} />
      </View>

      <View className="flex-1 gap-1">
        <Text
          className="text-foreground text-base font-bold tracking-wider"
          numberOfLines={1}
        >
          {card.word}
        </Text>
        <Text className="text-muted-foreground text-sm" numberOfLines={1}>
          {card.translation}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#6e9e8a" />
    </TouchableOpacity>
  );
}
