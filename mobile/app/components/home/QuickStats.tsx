import { View, Text, ActivityIndicator } from "react-native";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";

type QuickStatsProps = {
  totalDecks: number;
  totalCards: number;
  cardsInHand?: number;
  isLoading?: boolean;
};

export default function QuickStats({
  totalDecks,
  totalCards,
  cardsInHand,
  isLoading,
}: QuickStatsProps) {
  if (isLoading) {
    return (
      <View className="px-6 py-4 items-center">
        <ActivityIndicator size="large" color="#5b8af5" />
      </View>
    );
  }

  return (
    <View className="px-6 mt-4">
      <View className="flex-row justify-center gap-3 flex-wrap">
        <View
          className="flex-row items-center px-5 py-3 rounded-full"
          style={[{ backgroundColor: pillColors.blue }, pillShadow.default]}
        >
          <Text className="text-white text-sm font-black tracking-widest mr-2">
            DECKS
          </Text>
          <Text className="text-white text-xl font-black">{totalDecks}</Text>
        </View>

        {/* Cards pill - Yellow */}
        <View
          className="flex-row items-center px-5 py-3 rounded-full"
          style={[{ backgroundColor: pillColors.yellow }, pillShadow.default]}
        >
          <Text
            className="text-sm font-black tracking-widest mr-2"
            style={{ color: "#1a3328" }}
          >
            CARTES
          </Text>
          <Text className="text-xl font-black" style={{ color: "#1a3328" }}>
            {totalCards}
          </Text>
        </View>
      </View>
    </View>
  );
}
