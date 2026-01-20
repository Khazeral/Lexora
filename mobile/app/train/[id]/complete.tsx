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

  const totalCards = deck?.cards.length || 0;
  const cardsWithProgress = deck?.cards.filter((card) => card.progress) || [];
  const totalCorrect = cardsWithProgress.reduce(
    (sum, card) => sum + (card.progress?.successCount || 0),
    0
  );
  const totalIncorrect = cardsWithProgress.reduce(
    (sum, card) => sum + (card.progress?.failureCount || 0),
    0
  );
  const successRate =
    totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;

  const getBestStreak = () => {
    return Math.max(
      ...cardsWithProgress.map((card) => card.progress?.currentStreak || 0),
      0
    );
  };

    const getNextLevel = (maxStreak: number) => {
    if (maxStreak >= 100)
      return {
        level: "max",
        name: "Ruby",
        icon: "diamond",
        color: "#dc2626",
        required: 100,
      };
    if (maxStreak >= 70)
      return {
        level: "ruby",
        name: "Ruby",
        icon: "diamond",
        color: "#dc2626",
        required: 100,
      };
    if (maxStreak >= 50)
      return {
        level: "platinum",
        name: "Platinum",
        icon: "medal",
        color: "#94a3b8",
        required: 70,
      };
    if (maxStreak >= 30)
      return {
        level: "gold",
        name: "Gold",
        icon: "trophy",
        color: "#f59e0b",
        required: 50,
      };
    if (maxStreak >= 10)
      return {
        level: "silver",
        name: "Silver",
        icon: "ribbon",
        color: "#d1d5db",
        required: 30,
      };
    return {
      level: "bronze",
      name: "Bronze",
      icon: "help-circle",
      color: "#cd7f32",
      required: 3,
    };
  };

  const getAlmostUpgradeCards = () => {
    return cardsWithProgress
      .map((card) => {
        const maxStreak = card.progress?.maxStreak || 0;
        const nextLevel = getNextLevel(maxStreak);

        if (nextLevel.level === "max") return null;

        const remaining = nextLevel.required - maxStreak;
        const percentToNext = ((nextLevel.required - remaining) / nextLevel.required) * 100;

        return {
          ...card,
          remaining,
          nextLevel,
          percentToNext,
        };
      })
      .filter(
        (card) => card !== null && card.remaining > 0 && card.remaining <= 3
      )
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 3);
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

  const almostUpgradeCards = getAlmostUpgradeCards();

  console.log(almostUpgradeCards)

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        style={styles.headerGradient}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Ionicons name="trophy" size={64} color="#fff" />
        </Animated.View>
        <Text style={styles.headerTitle}>Session Complete! 🎉</Text>
        <Text style={styles.headerSubtitle}>{deck?.name}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
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

        {almostUpgradeCards.length > 0 && (
          <View style={styles.levelUpSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up" size={24} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Almost There! 🚀</Text>
            </View>

            {almostUpgradeCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.levelUpCard}
                onPress={() => router.push(`/card/${card.id}`)}
              >
                <View style={styles.levelUpCardHeader}>
                  <View style={styles.levelUpCardInfo}>
                    <Text style={styles.levelUpCardQuestion} numberOfLines={1}>
                      {card.word}
                    </Text>
                    <Text style={styles.levelUpCardTranslation} numberOfLines={1}>
                      {card.translation}
                    </Text>
                  </View>
                  <View style={styles.levelUpRemaining}>
                    <Ionicons
                      name={card.nextLevel.icon as any}
                      size={16}
                      color={card.nextLevel.color}
                    />
                    <Text style={styles.levelUpRemainingText}>
                      {card.remaining} more
                    </Text>
                  </View>
                </View>

                <View style={styles.levelProgressContainer}>
                  <View style={styles.levelProgressTrack}>
                    <View
                      style={[
                        styles.levelProgressFill,
                        {
                          width: `${card.percentToNext}%`,
                          backgroundColor: card.nextLevel.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.levelProgressText}>
                    → {card.nextLevel.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}


      </ScrollView>

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
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  performanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginTop: -20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
  },
  successRateContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  successRateLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  successRateValue: {
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  levelUpSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  levelUpCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  levelUpCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  levelUpCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  levelUpCardQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  levelUpCardTranslation: {
    fontSize: 13,
    color: "#64748b",
  },
  levelUpRemaining: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelUpRemainingText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },
  levelProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  levelProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  levelProgressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    minWidth: 70,
    textAlign: "right",
  },
  tipsCard: {
    flexDirection: "row",
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 100,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  homeButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  homeButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
});