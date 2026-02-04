import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { getAchievements, Achievement } from "@/services/achievements.api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

type Category = "all" | "cards" | "training" | "streaks" | "collection";

const categories: { key: Category; label: string; icon: string }[] = [
  { key: "all", label: "Tous", icon: "grid" },
  { key: "cards", label: "Cartes", icon: "albums" },
  { key: "training", label: "Entraînement", icon: "fitness" },
  { key: "streaks", label: "Séries", icon: "flame" },
  { key: "collection", label: "Collection", icon: "diamond" },
];

const getRarityConfig = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return {
        colors: ["#fbbf24", "#f59e0b", "#d97706"] as const,
        bgColor: "#fffbeb",
        borderColor: "#fbbf24",
        textColor: "#b45309",
        label: "Légendaire",
      };
    case "epic":
      return {
        colors: ["#a855f7", "#9333ea", "#7c3aed"] as const,
        bgColor: "#faf5ff",
        borderColor: "#a855f7",
        textColor: "#7c3aed",
        label: "Épique",
      };
    case "rare":
      return {
        colors: ["#3b82f6", "#2563eb", "#1d4ed8"] as const,
        bgColor: "#eff6ff",
        borderColor: "#3b82f6",
        textColor: "#1d4ed8",
        label: "Rare",
      };
    default:
      return {
        colors: ["#6b7280", "#4b5563", "#374151"] as const,
        bgColor: "#f9fafb",
        borderColor: "#d1d5db",
        textColor: "#4b5563",
        label: "Commun",
      };
  }
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const config = getRarityConfig(achievement.rarity);
  const progress = Math.min(
    (achievement.progress / achievement.target) * 100,
    100,
  );

  return (
    <View
      style={[
        styles.achievementCard,
        achievement.unlocked && styles.achievementCardUnlocked,
        achievement.unlocked && { borderColor: config.borderColor },
      ]}
    >
      {achievement.unlocked && (
        <View
          style={[styles.rarityBadge, { backgroundColor: config.borderColor }]}
        >
          <Text style={styles.rarityBadgeText}>{config.label}</Text>
        </View>
      )}

      <View
        style={[
          styles.iconContainer,
          achievement.unlocked
            ? { backgroundColor: config.bgColor }
            : styles.iconContainerLocked,
        ]}
      >
        {achievement.unlocked ? (
          <LinearGradient colors={config.colors} style={styles.iconGradient}>
            <Ionicons name={achievement.icon as any} size={28} color="#fff" />
          </LinearGradient>
        ) : (
          <Ionicons name={achievement.icon as any} size={28} color="#cbd5e1" />
        )}
      </View>

      <Text
        style={[
          styles.achievementName,
          !achievement.unlocked && styles.achievementNameLocked,
        ]}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>

      <Text style={styles.achievementDescription} numberOfLines={2}>
        {achievement.description}
      </Text>

      {!achievement.unlocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={config.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.target}
          </Text>
        </View>
      )}

      {achievement.unlocked && achievement.unlockedAt && (
        <View style={styles.unlockedBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#10b981" />
          <Text style={styles.unlockedText}>Débloqué</Text>
        </View>
      )}
    </View>
  );
}

function StatsHeader({ achievements }: { achievements: Achievement[] }) {
  const total = achievements.length;
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  const rarityStats = {
    legendary: achievements.filter(
      (a) => a.rarity === "legendary" && a.unlocked,
    ).length,
    epic: achievements.filter((a) => a.rarity === "epic" && a.unlocked).length,
    rare: achievements.filter((a) => a.rarity === "rare" && a.unlocked).length,
    common: achievements.filter((a) => a.rarity === "common" && a.unlocked)
      .length,
  };

  return (
    <View style={styles.statsHeader}>
      <LinearGradient
        colors={["#1e293b", "#334155", "#1e293b"]}
        style={styles.statsGradient}
      >
        <View style={styles.mainStats}>
          <View style={styles.trophyIcon}>
            <Ionicons name="trophy" size={40} color="#fbbf24" />
          </View>
          <View style={styles.mainStatsText}>
            <Text style={styles.statsTitle}>
              {unlocked}/{total} Achievements
            </Text>
            <Text style={styles.statsSubtitle}>{percentage}% complété</Text>
          </View>
        </View>

        <View style={styles.globalProgressBar}>
          <LinearGradient
            colors={["#fbbf24", "#f59e0b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.globalProgressFill, { width: `${percentage}%` }]}
          />
        </View>

        <View style={styles.rarityStats}>
          <View style={styles.rarityStat}>
            <Ionicons name="diamond" size={16} color="#fbbf24" />
            <Text style={styles.rarityStatText}>{rarityStats.legendary}</Text>
          </View>
          <View style={styles.rarityStat}>
            <Ionicons name="star" size={16} color="#a855f7" />
            <Text style={styles.rarityStatText}>{rarityStats.epic}</Text>
          </View>
          <View style={styles.rarityStat}>
            <Ionicons name="medal" size={16} color="#3b82f6" />
            <Text style={styles.rarityStatText}>{rarityStats.rare}</Text>
          </View>
          <View style={styles.rarityStat}>
            <Ionicons name="ellipse" size={16} color="#6b7280" />
            <Text style={styles.rarityStatText}>{rarityStats.common}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function AchievementsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const {
    data: achievements = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  const filteredAchievements = achievements.filter((a) => {
    if (selectedCategory === "all") return true;
    return a.category === selectedCategory;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;

    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StatsHeader achievements={achievements} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key &&
                  styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={selectedCategory === category.key ? "#fff" : "#64748b"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key &&
                    styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.achievementsGrid}>
          {sortedAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {sortedAchievements.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              Aucun achievement dans cette catégorie
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },

  statsHeader: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  statsGradient: {
    padding: 20,
  },
  mainStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  trophyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  mainStatsText: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statsSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  globalProgressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  globalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  rarityStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rarityStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rarityStatText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  categoryTextActive: {
    color: "#fff",
  },

  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  achievementCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  achievementCardUnlocked: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rarityBadge: {
    position: "absolute",
    top: -8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rarityBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  iconContainerLocked: {
    backgroundColor: "#f1f5f9",
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: "#94a3b8",
  },
  achievementDescription: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 15,
    marginBottom: 8,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  unlockedText: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
  },

  bottomPadding: {
    height: 32,
  },
});
