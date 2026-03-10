import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

type DailyGoalProps = {
  completedToday: number;
  dailyGoal: number;
};

export default function DailyGoal({
  completedToday,
  dailyGoal,
}: DailyGoalProps) {
  const { t } = useTranslation();
  const progress = Math.min((completedToday / dailyGoal) * 100, 100);
  const isCompleted = completedToday >= dailyGoal;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconBadge,
                isCompleted && styles.iconBadgeCompleted,
              ]}
            >
              <Ionicons
                name={isCompleted ? "checkmark-circle" : "trophy"}
                size={24}
                color={isCompleted ? "#10b981" : "#f59e0b"}
              />
            </View>
            <View>
              <Text style={styles.title}>{t("home.dailyGoal.title")}</Text>
              <Text style={styles.subtitle}>
                {isCompleted
                  ? t("home.dailyGoal.completed")
                  : t("home.dailyGoal.remaining", {
                      count: dailyGoal - completedToday,
                    })}
              </Text>
            </View>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {completedToday}/{dailyGoal}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <LinearGradient
              colors={
                isCompleted ? ["#10b981", "#059669"] : ["#f59e0b", "#d97706"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBadgeCompleted: {
    backgroundColor: "#d1fae5",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  progressCircle: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  progressBarContainer: {
    marginTop: 4,
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
