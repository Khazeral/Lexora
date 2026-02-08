import { View, Text, StyleSheet, Animated } from "react-native";
import { useTranslation } from "react-i18next";

type PerformanceCardProps = {
  successRate: number;
  fadeAnim: Animated.Value;
};

export default function PerformanceCard({
  successRate,
  fadeAnim,
}: PerformanceCardProps) {
  const { t } = useTranslation();

  const getMessage = () => {
    if (successRate >= 90) return t("trainComplete.performance.outstanding");
    if (successRate >= 75) return t("trainComplete.performance.greatJob");
    if (successRate >= 60) return t("trainComplete.performance.goodEffort");
    if (successRate >= 40) return t("trainComplete.performance.keepPracticing");
    return t("trainComplete.performance.roomForImprovement");
  };

  const getColor = () => {
    if (successRate >= 75) return "#10b981";
    if (successRate >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{getMessage()}</Text>
      <View style={styles.rateContainer}>
        <Text style={styles.rateLabel}>
          {t("trainComplete.performance.successRate")}
        </Text>
        <Text style={[styles.rateValue, { color: getColor() }]}>
          {successRate}%
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${successRate}%`, backgroundColor: getColor() },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 0,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
  },
  rateContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  rateLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
});
