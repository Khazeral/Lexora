import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCard } from "@/services/cards.api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/services/auth_context";

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: card, isLoading } = useQuery({
    queryKey: ["card", id],
    queryFn: () => getCard(Number(id)),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>Card not found</Text>
      </View>
    );
  }

  // Trouve le progress ou crée un objet par défaut
  const progress = card.progress?.find((p) => p.userId === user?.id) || {
    userId: user?.id || 0,
    successCount: 0,
    failureCount: 0,
    currentStreak: 0,
    maxStreak: 0,
    status: "bronze",
  };

  const successRate =
    progress.successCount + progress.failureCount > 0
      ? Math.round(
          (progress.successCount /
            (progress.successCount + progress.failureCount)) *
            100,
        )
      : 0;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ruby":
        return "#dc2626";
      case "platinum":
        return "#94a3b8";
      case "gold":
        return "#f59e0b";
      case "silver":
        return "#d1d5db";
      default:
        return "#cd7f32";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "ruby":
        return "diamond";
      case "platinum":
        return "medal";
      case "gold":
        return "trophy";
      case "silver":
        return "ribbon";
      default:
        return "help-circle";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Flashcard Display */}
        <View style={styles.flashcard}>
          <View style={styles.cardSide}>
            <Text style={styles.sideLabel}>Front</Text>
            <Text style={styles.cardText}>{card.word}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardSide}>
            <Text style={styles.sideLabel}>Back</Text>
            <Text style={styles.cardText}>{card.translation}</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(progress.status) },
            ]}
          >
            <Ionicons
              name={getStatusIcon(progress.status) as any}
              size={24}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {progress.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text style={styles.statValue}>{progress.successCount}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={32} color="#ef4444" />
              <Text style={styles.statValue}>{progress.failureCount}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="flash" size={32} color="#f59e0b" />
              <Text style={styles.statValue}>{progress.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trophy" size={32} color="#3b82f6" />
              <Text style={styles.statValue}>{progress.maxStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          {/* Success Rate */}
          <View style={styles.progressBar}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Success Rate</Text>
              <Text style={styles.progressPercentage}>{successRate}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${successRate}%`,
                    backgroundColor:
                      successRate >= 70
                        ? "#10b981"
                        : successRate >= 40
                          ? "#f59e0b"
                          : "#ef4444",
                  },
                ]}
              />
            </View>
          </View>

          {/* Next Milestone */}
          <View style={styles.milestone}>
            <Text style={styles.milestoneTitle}>Next Milestone</Text>
            {progress.maxStreak < 3 && (
              <Text style={styles.milestoneText}>
                🥈 {3 - progress.maxStreak} more correct in a row for Silver
              </Text>
            )}
            {progress.maxStreak >= 3 && progress.maxStreak < 5 && (
              <Text style={styles.milestoneText}>
                🥇 {5 - progress.maxStreak} more correct in a row for Gold
              </Text>
            )}
            {progress.maxStreak >= 5 && progress.maxStreak < 7 && (
              <Text style={styles.milestoneText}>
                💎 {7 - progress.maxStreak} more correct in a row for Platinum
              </Text>
            )}
            {progress.maxStreak >= 7 && progress.maxStreak < 10 && (
              <Text style={styles.milestoneText}>
                💎 {10 - progress.maxStreak} more correct in a row for Ruby
              </Text>
            )}
            {progress.maxStreak >= 10 && (
              <Text style={styles.milestoneText}>
                🎉 You've reached the maximum rank!
              </Text>
            )}
          </View>

          {/* Message si nouvelle carte */}
          {progress.successCount === 0 && progress.failureCount === 0 && (
            <View style={styles.newCardBanner}>
              <Ionicons name="sparkles" size={24} color="#3b82f6" />
              <Text style={styles.newCardText}>
                New card! Start practicing to track your progress.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  flashcard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSide: {
    alignItems: "center",
    paddingVertical: 16,
  },
  sideLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  progressBar: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  milestone: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 16,
    color: "#1e293b",
  },
  newCardBanner: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  newCardText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
  },
});
