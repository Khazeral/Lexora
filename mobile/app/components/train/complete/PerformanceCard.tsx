import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type PerformanceCardProps = {
  successRate: number;
};

export default function PerformanceCard({ successRate }: PerformanceCardProps) {
  const { t } = useTranslation();

  const getMessage = () => {
    if (successRate >= 90) return t("trainComplete.performance.outstanding");
    if (successRate >= 75) return t("trainComplete.performance.greatJob");
    if (successRate >= 60) return t("trainComplete.performance.goodEffort");
    if (successRate >= 40) return t("trainComplete.performance.keepPracticing");
    return t("trainComplete.performance.roomForImprovement");
  };

  const getColor = () => {
    if (successRate >= 75) return { text: "#44d9a0", bg: "#1a3d2e" };
    if (successRate >= 50) return { text: "#f5c542", bg: "#3d2e1a" };
    return { text: "#e8453c", bg: "#3d1a1a" };
  };

  const colors = getColor();

  return (
    <View
      className="mx-6 mb-4 p-6 bg-card rounded-2xl border-2 border-border"
      style={pillShadow.card}
    >
      {/* Message */}
      <Text className="text-foreground text-xl font-bold text-center mb-4 tracking-wider">
        {getMessage().toUpperCase()}
      </Text>

      {/* Rate */}
      <View className="items-center mb-4">
        <Text className="text-muted-foreground text-xs font-bold tracking-widest mb-2">
          {t("trainComplete.performance.successRate").toUpperCase()}
        </Text>
        <Text
          className="text-5xl font-black"
          style={{
            color: colors.text,
            textShadowColor: colors.text,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}
        >
          {successRate}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="h-4 bg-badge-dark rounded-full overflow-hidden border border-border">
        <View
          className="h-full rounded-full"
          style={{
            width: `${successRate}%`,
            backgroundColor: colors.text,
          }}
        />
      </View>
    </View>
  );
}
