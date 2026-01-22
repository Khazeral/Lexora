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
import { getDeckRecords } from "@/services/deck_records.api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/services/auth_context";

export default function TrainingCompleteScreen() {
  const {
    id,
    sessionCorrect,
    sessionIncorrect,
    sessionBestStreak,
    gameMode,
    finalTime,
    timePenalty,
    livesLeft,
    isPerfect,
  } = useLocalSearchParams();

  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const { user } = useAuth();

  const { data: deck } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
    refetchOnMount: "always",
    staleTime: 0,
  });

  const { data: deckRecords } = useQuery({
    queryKey: ["deckRecords", id, user?.id],
    queryFn: () => getDeckRecords(Number(id)),
    enabled: !!user && !!id,
    refetchOnMount: "always",
    staleTime: 0,
  });

  const totalCorrect = Number(sessionCorrect) || 0;
  const totalIncorrect = Number(sessionIncorrect) || 0;
  const bestStreak = Number(sessionBestStreak) || 0;
  const currentGameMode = (gameMode as string) || "classic";
  const speedRunTime = Number(finalTime) || 0;
  const speedRunPenalty = Number(timePenalty) || 0;
  const currentLives = Number(livesLeft) || 0;
  const wasPerfect = isPerfect === "true";

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
  const successRate =
    totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;

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
      required: 10,
    };
  };

  const getAlmostUpgradeCards = () => {
    if (!deck) return [];

    const cardsWithProgress = deck.cards.filter((card) => card.progress) || [];

    const cardsWithUpgradeInfo = cardsWithProgress
      .map((card) => {
        const maxStreak = card.progress?.maxStreak || 0;
        const nextLevel = getNextLevel(maxStreak);

        if (nextLevel.level === "max") return null;

        const remaining = nextLevel.required - maxStreak;
        const percentToNext =
          ((nextLevel.required - remaining) / nextLevel.required) * 100;

        return {
          ...card,
          remaining,
          nextLevel,
          percentToNext,
        };
      })
      .filter((card) => card !== null && card.remaining > 0);

    if (totalCards >= 3) {
      return cardsWithUpgradeInfo
        .sort((a, b) => a.remaining - b.remaining)
        .slice(0, 3);
    }

    return cardsWithUpgradeInfo
      .filter((card) => card.remaining <= 3)
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

  // Fonction pour formater le temps en MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Fonction pour obtenir les stats spécifiques au mode
  const getModeSpecificStats = () => {
    if (!deckRecords) return null;

    switch (currentGameMode) {
      case "speedrun": {
        const isFirstRun = !deckRecords.bestSpeedRunTime;

        if (isFirstRun) {
          return {
            title: "⚡ First Speed Run!",
            mainValue: formatTime(speedRunTime),
            mainLabel: "Your Time",
            subtitle: "This is your first speed run on this deck!",
            color: "#f59e0b",
            icon: "flash" as const,
            isRecord: true,
            stats: [
              {
                label: "Penalties",
                value: `+${speedRunPenalty}s`,
                icon: "warning" as const,
              },
              {
                label: "Net Time",
                value: formatTime(speedRunTime - speedRunPenalty),
                icon: "timer" as const,
              },
            ],
          };
        }

        const diff = speedRunTime - deckRecords.bestSpeedRunTime!;
        const isNewRecord = diff < 0;

        return {
          title: isNewRecord ? "🎉 New Record!" : "Speed Run Complete",
          mainValue: formatTime(speedRunTime),
          mainLabel: "Your Time",
          subtitle: isNewRecord
            ? `You beat your record by ${Math.abs(diff)} seconds!`
            : `${diff} seconds slower than your best`,
          color: isNewRecord ? "#10b981" : "#f59e0b",
          icon: "flash" as const,
          isRecord: isNewRecord,
          comparison: {
            label: "Previous Best",
            value: formatTime(deckRecords.bestSpeedRunTime!),
            diff: diff,
          },
          stats: [
            {
              label: "Penalties",
              value: `+${speedRunPenalty}s`,
              icon: "warning" as const,
            },
            {
              label: "Attempts",
              value: deckRecords.speedRunAttempts.toString(),
              icon: "repeat" as const,
            },
          ],
        };
      }

      case "streak": {
        const isFirstRun = deckRecords.bestStreak === 0;

        if (isFirstRun) {
          return {
            title: "🔥 First Streak Run!",
            mainValue: bestStreak.toString(),
            mainLabel: "Best Streak",
            subtitle: `You kept ${currentLives} ${currentLives === 1 ? "life" : "lives"} remaining!`,
            color: "#ef4444",
            icon: "flame" as const,
            isRecord: true,
            stats: [
              {
                label: "Lives Left",
                value: currentLives.toString(),
                icon: "heart" as const,
              },
              {
                label: "Cards",
                value: totalCards.toString(),
                icon: "albums" as const,
              },
            ],
          };
        }

        const isNewRecord = bestStreak > deckRecords.bestStreak;
        const diff = bestStreak - deckRecords.bestStreak;

        return {
          title: isNewRecord ? "🔥 New Streak Record!" : "Streak Master",
          mainValue: bestStreak.toString(),
          mainLabel: "Your Streak",
          subtitle: isNewRecord
            ? `You beat your record by ${diff}!`
            : `${Math.abs(diff)} away from your record`,
          color: isNewRecord ? "#10b981" : "#ef4444",
          icon: "flame" as const,
          isRecord: isNewRecord,
          comparison: isNewRecord
            ? {
                label: "Previous Best",
                value: deckRecords.bestStreak.toString(),
                diff: diff,
              }
            : undefined,
          stats: [
            {
              label: "Lives Left",
              value: currentLives.toString(),
              icon: "heart" as const,
            },
            {
              label: "Record",
              value: deckRecords.bestStreak.toString(),
              icon: "trophy" as const,
            },
          ],
        };
      }

      case "timeattack": {
        const avgTime = totalCards > 0 ? (10 * totalCards) / totalCards : 0; // Approximation
        const isFirstRun = !deckRecords.bestAvgTimePerCard;

        if (isFirstRun) {
          return {
            title: "🎯 First Time Attack!",
            mainValue: `${avgTime.toFixed(1)}s`,
            mainLabel: "Avg per Card",
            subtitle: "Great first attempt!",
            color: "#8b5cf6",
            icon: "timer" as const,
            isRecord: true,
            stats: [
              {
                label: "Cards",
                value: totalCards.toString(),
                icon: "albums" as const,
              },
              {
                label: "Total Time",
                value: `${totalCards * 10}s`,
                icon: "time" as const,
              },
            ],
          };
        }

        const isNewRecord = avgTime < deckRecords.bestAvgTimePerCard!;

        return {
          title: isNewRecord ? "🎯 New Record!" : "Time Attack Complete",
          mainValue: `${avgTime.toFixed(1)}s`,
          mainLabel: "Avg per Card",
          subtitle: isNewRecord
            ? "You improved your average time!"
            : "Keep practicing for better times!",
          color: isNewRecord ? "#10b981" : "#8b5cf6",
          icon: "timer" as const,
          isRecord: isNewRecord,
          comparison: {
            label: "Previous Best",
            value: `${deckRecords.bestAvgTimePerCard!.toFixed(1)}s`,
            diff: avgTime - deckRecords.bestAvgTimePerCard!,
          },
          stats: [
            {
              label: "Cards",
              value: totalCards.toString(),
              icon: "albums" as const,
            },
            {
              label: "Attempts",
              value: deckRecords.timeAttackAttempts.toString(),
              icon: "repeat" as const,
            },
          ],
        };
      }

      case "perfect": {
        if (wasPerfect) {
          return {
            title: "💎 Perfect Run!",
            mainValue: "FLAWLESS",
            mainLabel: "Victory",
            subtitle: `${deckRecords.perfectRunsCompleted + 1} perfect ${deckRecords.perfectRunsCompleted + 1 === 1 ? "run" : "runs"} completed!`,
            color: "#ec4899",
            icon: "diamond" as const,
            isRecord: true,
            stats: [
              {
                label: "Success Rate",
                value: `${Math.round(((deckRecords.perfectRunsCompleted + 1) / (deckRecords.perfectRunAttempts + 1)) * 100)}%`,
                icon: "stats-chart" as const,
              },
              {
                label: "Total Attempts",
                value: (deckRecords.perfectRunAttempts + 1).toString(),
                icon: "repeat" as const,
              },
            ],
          };
        } else {
          return {
            title: "💔 Perfect Run Failed",
            mainValue: deckRecords.perfectRunsCompleted.toString(),
            mainLabel: "Perfect Runs",
            subtitle: "Keep trying! You'll get it next time.",
            color: "#64748b",
            icon: "close-circle" as const,
            isRecord: false,
            stats: [
              {
                label: "Success Rate",
                value: `${deckRecords.perfectRunAttempts > 0 ? Math.round((deckRecords.perfectRunsCompleted / deckRecords.perfectRunAttempts) * 100) : 0}%`,
                icon: "stats-chart" as const,
              },
              {
                label: "Attempts",
                value: deckRecords.perfectRunAttempts.toString(),
                icon: "repeat" as const,
              },
            ],
          };
        }
      }

      default:
        return null;
    }
  };

  const modeStats = getModeSpecificStats();
  const almostUpgradeCards = getAlmostUpgradeCards();

  // Déterminer l'icône et les couleurs du header selon le mode et le résultat
  const getHeaderConfig = () => {
    if (currentGameMode === "perfect" && wasPerfect) {
      return {
        icon: "diamond",
        colors: ["#ec4899", "#db2777"],
        title: "Perfect Run! 💎",
      };
    }
    if (modeStats?.isRecord) {
      return {
        icon: "trophy",
        colors: ["#10b981", "#059669"],
        title: "New Record! 🎉",
      };
    }
    return {
      icon: "trophy",
      colors: ["#3b82f6", "#2563eb"],
      title: "Session Complete! 🎉",
    };
  };

  const headerConfig = getHeaderConfig();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={headerConfig.colors}
        style={styles.headerGradient}
      >
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <Ionicons name={headerConfig.icon as any} size={64} color="#fff" />
        </Animated.View>
        <Text style={styles.headerTitle}>{headerConfig.title}</Text>
        <Text style={styles.headerSubtitle}>{deck?.name}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode-specific stats card */}
        {modeStats && (
          <Animated.View style={[styles.modeStatsCard, { opacity: fadeAnim }]}>
            <View style={styles.modeStatsHeader}>
              <View
                style={[
                  styles.modeIconBadge,
                  { backgroundColor: modeStats.color + "20" },
                ]}
              >
                <Ionicons
                  name={modeStats.icon}
                  size={32}
                  color={modeStats.color}
                />
              </View>
              <View style={styles.modeStatsHeaderText}>
                <Text style={styles.modeStatsTitle}>{modeStats.title}</Text>
                <Text style={styles.modeStatsSubtitle}>
                  {modeStats.subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.modeMainValue}>
              <Text style={[styles.modeValue, { color: modeStats.color }]}>
                {modeStats.mainValue}
              </Text>
              <Text style={styles.modeValueLabel}>{modeStats.mainLabel}</Text>
            </View>

            {modeStats.comparison && (
              <View style={styles.comparisonContainer}>
                <View style={styles.comparisonDivider} />
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
                      color={
                        modeStats.comparison.diff < 0 ? "#10b981" : "#ef4444"
                      }
                    />
                    <Text
                      style={[
                        styles.comparisonDiffText,
                        {
                          color:
                            modeStats.comparison.diff < 0
                              ? "#10b981"
                              : "#ef4444",
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
              <View style={styles.modeStatsGrid}>
                {modeStats.stats.map((stat, index) => (
                  <View key={index} style={styles.modeStatItem}>
                    <Ionicons name={stat.icon} size={20} color="#64748b" />
                    <Text style={styles.modeStatValue}>{stat.value}</Text>
                    <Text style={styles.modeStatLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        )}

        {/* Performance card - only for non-perfect modes or failed perfect runs */}
        {currentGameMode !== "perfect" || !wasPerfect ? (
          <Animated.View
            style={[styles.performanceCard, { opacity: fadeAnim }]}
          >
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
        ) : null}

        {/* Stats grid */}
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
            <Text style={styles.statValue}>{bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Almost there section */}
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
                    <Text
                      style={styles.levelUpCardTranslation}
                      numberOfLines={1}
                    >
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
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
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
  },
  modeStatsCard: {
    margin: 16,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modeStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  modeIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modeStatsHeaderText: {
    flex: 1,
  },
  modeStatsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  modeStatsSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  modeMainValue: {
    alignItems: "center",
    marginBottom: 20,
  },
  modeValue: {
    fontSize: 56,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modeValueLabel: {
    fontSize: 14,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  comparisonContainer: {
    marginTop: 16,
  },
  comparisonDivider: {
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
  modeStatsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  modeStatItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  modeStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modeStatLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
  },
  performanceCard: {
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
  performanceMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
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
    paddingHorizontal: 16,
    gap: 12,
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
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
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
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 12,
  },
  levelUpCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelUpCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  levelUpCardQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  levelUpCardTranslation: {
    fontSize: 14,
    color: "#64748b",
  },
  levelUpRemaining: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelUpRemainingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
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
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
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
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  homeButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
});
