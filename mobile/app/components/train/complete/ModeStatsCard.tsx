import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pillShadow } from "@/app/components/ui/GlowStyles";

type ModeStats = {
  title: string;
  mainValue: string;
  mainLabel: string;
  subtitle: string;
  color: string;
  icon: string;
  isRecord: boolean;
  comparison?: {
    label: string;
    value: string;
    diff: number;
  };
  stats?: {
    label: string;
    value: string;
    icon: string;
  }[];
};

type ModeStatsCardProps = {
  modeStats: ModeStats;
};

// Mapping des couleurs vers le style KotobaCards
const getKotobaColor = (color: string) => {
  const colorMap: Record<string, { bg: string; icon: string }> = {
    "#3b82f6": { bg: "#1a3a5c", icon: "#5b8af5" },
    "#f59e0b": { bg: "#3d2e1a", icon: "#f5c542" },
    "#ef4444": { bg: "#3d1a1a", icon: "#e8453c" },
    "#8b5cf6": { bg: "#2e1a3d", icon: "#a855f7" },
    "#ec4899": { bg: "#3d1a2e", icon: "#f472b6" },
    "#10b981": { bg: "#1a3d2e", icon: "#44d9a0" },
    "#06b6d4": { bg: "#0d3a3a", icon: "#06b6d4" },
  };
  return colorMap[color] || { bg: "#1a3a5c", icon: "#5b8af5" };
};

export default function ModeStatsCard({ modeStats }: ModeStatsCardProps) {
  const colors = getKotobaColor(modeStats.color);

  return (
    <View
      className="mx-6 my-4 p-6 bg-card rounded-2xl border-2 border-border"
      style={pillShadow.card}
    >
      {/* Header */}
      <View className="flex-row items-center gap-4 mb-6">
        <View
          className="w-16 h-16 rounded-xl items-center justify-center"
          style={[{ backgroundColor: colors.bg }, pillShadow.sm]}
        >
          <Ionicons
            name={modeStats.icon as any}
            size={32}
            color={colors.icon}
          />
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-lg font-bold tracking-wider">
            {modeStats.title.toUpperCase()}
          </Text>
          <Text className="text-muted-foreground text-sm mt-1">
            {modeStats.subtitle}
          </Text>
        </View>
      </View>

      {/* Main Value */}
      <View className="items-center mb-6">
        <Text
          className="text-5xl font-black mb-1"
          style={{
            color: colors.icon,
            textShadowColor: colors.icon,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: modeStats.isRecord ? 20 : 0,
          }}
        >
          {modeStats.mainValue}
        </Text>
        <Text className="text-muted-foreground text-xs font-bold tracking-widest">
          {modeStats.mainLabel.toUpperCase()}
        </Text>
      </View>

      {/* Comparison */}
      {modeStats.comparison && (
        <View className="border-t-2 border-border pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-muted-foreground text-xs font-bold tracking-wider mb-1">
                {modeStats.comparison.label.toUpperCase()}
              </Text>
              <Text className="text-foreground text-xl font-bold">
                {modeStats.comparison.value}
              </Text>
            </View>
            <View
              className="flex-row items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                backgroundColor:
                  modeStats.comparison.diff < 0 ? "#1a3d2e" : "#3d1a1a",
              }}
            >
              <Ionicons
                name={
                  modeStats.comparison.diff < 0
                    ? "trending-down"
                    : "trending-up"
                }
                size={18}
                color={modeStats.comparison.diff < 0 ? "#44d9a0" : "#e8453c"}
              />
              <Text
                className="text-base font-bold"
                style={{
                  color: modeStats.comparison.diff < 0 ? "#44d9a0" : "#e8453c",
                }}
              >
                {Math.abs(modeStats.comparison.diff)}
                {typeof modeStats.comparison.diff === "number" &&
                modeStats.comparison.diff % 1 === 0
                  ? ""
                  : "s"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Additional Stats */}
      {modeStats.stats && modeStats.stats.length > 0 && (
        <View className="flex-row gap-3 border-t-2 border-border pt-4 mt-4">
          {modeStats.stats.map((stat, index) => (
            <View key={index} className="flex-1 items-center gap-2">
              <Ionicons name={stat.icon as any} size={20} color="#6e9e8a" />
              <Text className="text-foreground text-lg font-bold">
                {stat.value}
              </Text>
              <Text className="text-muted-foreground text-[10px] text-center font-semibold">
                {stat.label.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
