import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { getLevelColors } from "@/utils/getLevelColors";

type CardUpgrade = {
  id: number;
  word: string;
  translation: string;
  remaining: number;
  nextLevel: {
    name: string;
    icon: string;
    color: string;
  };
  percentToNext: number;
};

export default function AlmostThereSection({
  cards,
}: {
  cards: CardUpgrade[];
}) {
  const { t } = useTranslation();

  if (cards.length === 0) return null;

  return (
    <View className="mx-6 mt-4 p-4 bg-card rounded-2xl border-2 border-border">
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-10 h-10 rounded-xl bg-info items-center justify-center">
          <Ionicons name="trending-up" size={20} color="#fff" />
        </View>
        <Text className="text-foreground text-base font-bold tracking-wider">
          {t("trainComplete.almostThere.title").toUpperCase()}
        </Text>
      </View>

      {cards.map((card, index) => {
        const levelColors = getLevelColors(card.nextLevel.color);

        return (
          <TouchableOpacity
            key={card.id}
            className={`p-4 bg-secondary rounded-xl ${index < cards.length - 1 ? "mb-3" : ""}`}
            onPress={() => router.push(`/card/${card.id}`)}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-1 mr-3">
                <Text
                  className="text-foreground text-sm font-bold"
                  numberOfLines={1}
                >
                  {card.word}
                </Text>
                <Text
                  className="text-muted-foreground text-xs mt-0.5"
                  numberOfLines={1}
                >
                  {card.translation}
                </Text>
              </View>

              <View
                className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: levelColors.bg }}
              >
                <Ionicons
                  name={card.nextLevel.icon as any}
                  size={14}
                  color={levelColors.text}
                />
                <Text
                  className="text-xs font-bold"
                  style={{ color: levelColors.text }}
                >
                  {card.remaining} left
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="flex-1 h-2 bg-badge-dark rounded-full overflow-hidden border border-border">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${card.percentToNext}%`,
                    backgroundColor: levelColors.text,
                  }}
                />
              </View>
              <Text
                className="text-xs font-bold"
                style={{ color: levelColors.text }}
              >
                → {card.nextLevel.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
