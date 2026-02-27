import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type StatsGridProps = {
  correct: number;
  incorrect: number;
  bestStreak: number;
};

export default function StatsGrid({
  correct,
  incorrect,
  bestStreak,
}: StatsGridProps) {
  const { t } = useTranslation();

  const stats = [
    {
      icon: "checkmark-circle",
      iconColor: "#44d9a0",
      value: correct,
      label: t("trainComplete.stats.correct"),
    },
    {
      icon: "close-circle",
      iconColor: "#e8453c",
      value: incorrect,
      label: t("trainComplete.stats.incorrect"),
    },
    {
      icon: "flash",
      iconColor: "#f5c542",
      value: bestStreak,
      label: t("trainComplete.stats.bestStreak"),
    },
  ];

  return (
    <View className="mx-6 flex-row bg-card rounded-2xl border-2 border-border p-4">
      {stats.map((stat, index) => (
        <View key={index} className="flex-1 items-center gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={stat.icon as any}
              size={18}
              color={stat.iconColor}
            />
            <Text className="text-foreground text-xl font-black">
              {stat.value}
            </Text>
          </View>
          <Text className="text-muted-foreground text-[10px] font-bold tracking-wider text-center">
            {stat.label.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}
