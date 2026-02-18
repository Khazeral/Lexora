import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type StatsGridProps = {
  correct: number;
  incorrect: number;
  totalCards: number;
  bestStreak: number;
};

export default function StatsGrid({
  correct,
  incorrect,
  totalCards,
  bestStreak,
}: StatsGridProps) {
  const { t } = useTranslation();

  const stats = [
    {
      icon: "checkmark-circle",
      iconColor: "#44d9a0",
      bgColor: "#1a3d2e",
      value: correct,
      label: t("trainComplete.stats.correct"),
    },
    {
      icon: "close-circle",
      iconColor: "#e8453c",
      bgColor: "#3d1a1a",
      value: incorrect,
      label: t("trainComplete.stats.incorrect"),
    },
    {
      icon: "albums",
      iconColor: "#5b8af5",
      bgColor: "#1a3a5c",
      value: totalCards,
      label: t("trainComplete.stats.totalCards"),
    },
    {
      icon: "flash",
      iconColor: "#f5c542",
      bgColor: "#3d2e1a",
      value: bestStreak,
      label: t("trainComplete.stats.bestStreak"),
    },
  ];

  return (
    <View className="flex-row flex-wrap px-6 gap-3">
      {stats.map((stat, index) => (
        <View
          key={index}
          className="flex-1 min-w-[45%] bg-card p-4 rounded-2xl items-center border-2 border-border"
          style={pillShadow.sm}
        >
          {/* Icon */}
          <View
            className="w-14 h-14 rounded-xl items-center justify-center mb-3"
            style={[{ backgroundColor: stat.bgColor }, pillShadow.sm]}
          >
            <Ionicons
              name={stat.icon as any}
              size={28}
              color={stat.iconColor}
            />
          </View>

          {/* Value */}
          <Text className="text-foreground text-2xl font-black mb-1">
            {stat.value}
          </Text>

          {/* Label */}
          <Text className="text-muted-foreground text-[10px] font-bold tracking-wider text-center">
            {stat.label.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}
