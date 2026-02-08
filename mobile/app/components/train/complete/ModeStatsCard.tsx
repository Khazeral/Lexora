import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
  fadeAnim: Animated.Value;
  pulseAnim: Animated.Value;
};

export default function ModeStatsCard({
  modeStats,
  fadeAnim,
  pulseAnim,
}: ModeStatsCardProps) {
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {modeStats.isRecord && (
        <Animated.View
          style={[styles.recordBadge, { transform: [{ scale: pulseAnim }] }]}
        >
          <LinearGradient
            colors={["#fbbf24", "#f59e0b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.recordBadgeGradient}
          >
            <Ionicons name="trophy" size={16} color="#fff" />
            <Text style={styles.recordBadgeText}>NEW RECORD</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <View style={styles.header}>
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: modeStats.color + "20" },
          ]}
        >
          <Ionicons
            name={modeStats.icon as any}
            size={32}
            color={modeStats.color}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{modeStats.title}</Text>
          <Text style={styles.subtitle}>{modeStats.subtitle}</Text>
        </View>
      </View>

      <View style={styles.mainValue}>
        <Text
          style={[
            styles.value,
            { color: modeStats.color },
            modeStats.isRecord && styles.valueRecord,
          ]}
        >
          {modeStats.mainValue}
        </Text>
        <Text style={styles.valueLabel}>{modeStats.mainLabel}</Text>
      </View>

      {modeStats.comparison && (
        <View style={styles.comparisonContainer}>
          <View style={styles.divider} />
          <View style={styles.comparisonContent}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>
                {modeStats.comparison.label}
              </Text>
              <Text style={styles.comparisonValue}>
                {modeStats.comparison.value}
              </Text>
            </View>
            <View
              style={[
                styles.comparisonDiff,
                {
                  backgroundColor:
                    modeStats.comparison.diff < 0 ? "#dcfce7" : "#fee2e2",
                },
              ]}
            >
              <Ionicons
                name={
                  modeStats.comparison.diff < 0
                    ? "trending-down"
                    : "trending-up"
                }
                size={16}
                color={modeStats.comparison.diff < 0 ? "#10b981" : "#ef4444"}
              />
              <Text
                style={[
                  styles.comparisonDiffText,
                  {
                    color:
                      modeStats.comparison.diff < 0 ? "#10b981" : "#ef4444",
                  },
                ]}
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

      {modeStats.stats && (
        <View style={styles.statsGrid}>
          {modeStats.stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons name={stat.icon as any} size={20} color="#64748b" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: "relative",
    overflow: "visible",
  },
  recordBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    zIndex: 10,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  recordBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  mainValue: {
    alignItems: "center",
    marginBottom: 20,
  },
  value: {
    fontSize: 56,
    fontWeight: "bold",
    marginBottom: 4,
  },
  valueRecord: {
    textShadowColor: "rgba(16, 185, 129, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  valueLabel: {
    fontSize: 14,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  comparisonContainer: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 16,
  },
  comparisonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  comparisonItem: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  comparisonDiff: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  comparisonDiffText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
  },
});
