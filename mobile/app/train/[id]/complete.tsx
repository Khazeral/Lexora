import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TrainingCompleteScreen() {
  const { id } = useLocalSearchParams();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  const { data: deck } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculer les statistiques
  const totalCards = deck?.cards.length || 0;
  const cardsWithProgress = deck?.cards.filter((card) => card.progress) || [];
  const totalCorrect = cardsWithProgress.reduce(
    (sum, card) => sum + (card.progress?.successCount || 0),
    0,
  );
  const totalIncorrect = cardsWithProgress.reduce(
    (sum, card) => sum + (card.progress?.failureCount || 0),
    0,
  );
  const successRate =
    totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;

  const getBestStreak = () => {
    return Math.max(
      ...cardsWithProgress.map((card) => card.progress?.currentStreak || 0),
      0,
    );
  };

  const getPerformanceMessage = () => {
    if (successRate >= 90) return "🏆 Outstanding!";
    if (successRate >= 75) return "🌟 Great job!";
    if (successRate >= 60) return "👍 Good effort!";
    if (successRate >= 40) return "💪 Keep practicing!";
    return "📚 Room for improvement!";
  };

  const getPerformanceColor = () => {
    if (successRate >= 75) return "#10b981";
    if (successRate >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <View style={styles.container}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        style={styles.headerGradient}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons name="trophy" size={64} color="#fff" />
        </Animated.View>
        <Text style={styles.headerTitle}>Session Complete! 🎉</Text>
        <Text style={styles.headerSubtitle}>{deck?.name}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Performance Message */}
        <Animated.View style={[styles.performanceCard, { opacity: fadeAnim }]}>
          <Text style={styles.performanceMessage}>
            {getPerformanceMessage()}
          </Text>
          <View style={styles.successRateContainer}>
            <Text style={styles.successRateLabel}>Success Rate</Text>
            <Text
              style={[
                styles.successRateValue,
                { color: getPerformanceColor() },
              ]}
            >
              {successRate}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${successRate}%`,
                    backgroundColor: getPerformanceColor(),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#dcfce7" }]}>
              <Ionicons name="checkmark-circle" size={28} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{totalCorrect}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#fee2e2" }]}>
              <Ionicons name="close-circle" size={28} color="#ef4444" />
            </View>
            <Text style={styles.statValue}>{totalIncorrect}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#dbeafe" }]}>
              <Ionicons name="albums" size={28} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>{totalCards}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#fef3c7" }]}>
              <Ionicons name="flash" size={28} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>{getBestStreak()}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Motivational Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="bulb" size={24} color="#f59e0b" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>💡 Study Tips</Text>
            <Text style={styles.tipsText}>
              {successRate >= 80
                ? "Excellent work! Try increasing difficulty or learning new material."
                : successRate >= 60
                  ? "Good progress! Review the cards you missed and try again."
                  : "Don't give up! Consistent practice is the key to mastery."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push(`/deck/${id}`)}
        >
          <Ionicons name="albums" size={20} color="#3b82f6" />
          <Text style={styles.secondaryButtonText}>View Deck</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/train/[id]/settings",
              params: { id },
            })
          }
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Train Again</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Ionicons name="home" size={20} color="#64748b" />
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#bfdbfe",
  },
  content: {
    flex: 1,
  },
  performanceCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  performanceMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 24,
  },
  successRateContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  successRateLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  successRateValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  tipsCard: {
    backgroundColor: "#fffbeb",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  secondaryButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  homeButtonText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
});
