import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAchievements, Achievement } from "@/services/achievements.api";
import { pillShadow, pillColors } from "@/app/components/ui/GlowStyles";

const { width } = Dimensions.get("window");
const GRID_PADDING = 24;
const GRID_GAP = 12;
const CARD_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

type Category = "all" | "cards" | "training" | "streaks" | "collection";

const categories: { key: Category; label: string; icon: string }[] = [
  { key: "all", label: "ALL", icon: "grid" },
  { key: "cards", label: "CARDS", icon: "albums" },
  { key: "training", label: "TRAIN", icon: "fitness" },
  { key: "streaks", label: "STREAK", icon: "flame" },
  { key: "collection", label: "COLLECT", icon: "diamond" },
];

const getRarityConfig = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return {
        borderColor: "#fbbf24",
        label: "LEGENDARY",
        iconBg: "#fbbf24",
      };
    case "epic":
      return {
        borderColor: "#a855f7",
        label: "EPIC",
        iconBg: "#a855f7",
      };
    case "rare":
      return {
        borderColor: "#3b82f6",
        label: "RARE",
        iconBg: "#3b82f6",
      };
    default:
      return {
        borderColor: "#6b7280",
        label: "COMMON",
        iconBg: "#6b7280",
      };
  }
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const config = getRarityConfig(achievement.rarity);
  const progress = Math.min(
    (achievement.progress / achievement.target) * 100,
    100,
  );
  const isNew = achievement.unlocked && !achievement.seen;
  const isUnlocked = achievement.unlocked;

  return (
    <View
      style={[
        {
          width: CARD_WIDTH,
          backgroundColor: "#134c39",
          borderRadius: 16,
          padding: 16,
          borderWidth: 2,
          borderColor: isUnlocked ? config.borderColor : "#2a7a60",
        },
        pillShadow.sm,
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: -10,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <View
          style={{
            backgroundColor: isNew ? pillColors.red : config.borderColor,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 9,
              fontWeight: "800",
              letterSpacing: 1,
            }}
          >
            {isNew ? "NEW" : config.label}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 12, marginBottom: 12 }}>
        {isUnlocked ? (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: config.iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={achievement.icon as any} size={28} color="#fff" />
          </View>
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "#0a1f18",
              borderWidth: 2,
              borderColor: "#2a7a60",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={achievement.icon as any}
              size={28}
              color="#4a7a6a"
            />
          </View>
        )}
      </View>

      <Text
        style={{
          color: isUnlocked ? "#e8edf5" : "#6e9e8a",
          fontSize: 12,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 4,
          letterSpacing: 0.5,
        }}
        numberOfLines={2}
      >
        {achievement.name.toUpperCase()}
      </Text>

      <Text
        style={{
          color: "#6e9e8a",
          fontSize: 10,
          textAlign: "center",
          lineHeight: 14,
          marginBottom: 12,
        }}
        numberOfLines={2}
      >
        {achievement.description}
      </Text>

      {isUnlocked ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Ionicons name="checkmark-circle" size={14} color="#44d9a0" />
          <Text style={{ color: "#44d9a0", fontSize: 11, fontWeight: "700" }}>
            UNLOCKED
          </Text>
        </View>
      ) : (
        <View style={{ gap: 4 }}>
          <View
            style={{
              height: 8,
              backgroundColor: "#0a1f18",
              borderRadius: 4,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#2a7a60",
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: config.borderColor,
                borderRadius: 4,
              }}
            />
          </View>
          <Text
            style={{
              color: "#6e9e8a",
              fontSize: 10,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {achievement.progress}/{achievement.target}
          </Text>
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
    <View
      style={[
        {
          marginHorizontal: GRID_PADDING,
          marginBottom: 16,
          borderRadius: 16,
          backgroundColor: "#134c39",
          borderWidth: 2,
          borderColor: "#2a7a60",
          padding: 20,
        },
        pillShadow.card,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <View
          style={[
            {
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#f5c542",
              alignItems: "center",
              justifyContent: "center",
            },
            pillShadow.sm,
          ]}
        >
          <Ionicons name="trophy" size={32} color="#0b3d2e" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e8edf5", fontSize: 28, fontWeight: "900" }}>
            {unlocked}/{total}
          </Text>
          <Text style={{ color: "#6e9e8a", fontSize: 14 }}>
            {percentage}% completed
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 12,
          backgroundColor: "#0a1f18",
          borderRadius: 6,
          marginBottom: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#2a7a60",
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#f5c542",
            borderRadius: 6,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="diamond" size={18} color="#fbbf24" />
          <Text style={{ color: "#e8edf5", fontWeight: "700", fontSize: 16 }}>
            {rarityStats.legendary}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="star" size={18} color="#a855f7" />
          <Text style={{ color: "#e8edf5", fontWeight: "700", fontSize: 16 }}>
            {rarityStats.epic}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="medal" size={18} color="#3b82f6" />
          <Text style={{ color: "#e8edf5", fontWeight: "700", fontSize: 16 }}>
            {rarityStats.rare}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="ellipse" size={18} color="#6b7280" />
          <Text style={{ color: "#e8edf5", fontWeight: "700", fontSize: 16 }}>
            {rarityStats.common}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CategoriesFilter({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (cat: Category) => void;
}) {
  return (
    <View style={{ height: 70, marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: GRID_PADDING,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        {categories.map((category) => {
          const isActive = selected === category.key;
          return (
            <TouchableOpacity
              key={category.key}
              onPress={() => onSelect(category.key)}
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderRadius: 16,
                  borderWidth: 2,
                  backgroundColor: isActive ? "#5b8af5" : "#134c39",
                  borderColor: isActive ? "#5b8af5" : "#2a7a60",
                },
                pillShadow.sm,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={isActive ? "#fff" : "#6e9e8a"}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 1,
                  color: isActive ? "#fff" : "#6e9e8a",
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function AchievementsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const queryClient = useQueryClient();

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["achievements-unseen"] });
    };
  }, [queryClient]);

  const filteredAchievements = achievements.filter((a) => {
    if (selectedCategory === "all") return true;
    return a.category === selectedCategory;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    const aIsNew = a.unlocked && !a.seen;
    const bIsNew = b.unlocked && !b.seen;
    if (aIsNew && !bIsNew) return -1;
    if (!aIsNew && bIsNew) return 1;

    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;

    const rarityOrder: Record<string, number> = {
      legendary: 0,
      epic: 1,
      rare: 2,
      common: 3,
    };
    return (rarityOrder[a.rarity] || 4) - (rarityOrder[b.rarity] || 4);
  });

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#25603e",
          alignItems: "center",
          justifyContent: "center",
        }}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#e8453c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#25603e" }}
      edges={["top"]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: GRID_PADDING,
          paddingVertical: 16,
          borderBottomWidth: 2,
          borderBottomColor: "#2a7a60",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            {
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#134c39",
              borderWidth: 2,
              borderColor: "#2a7a60",
              alignItems: "center",
              justifyContent: "center",
            },
            pillShadow.sm,
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#e8edf5" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#e8edf5",
            fontSize: 18,
            fontWeight: "700",
            letterSpacing: 2,
          }}
        >
          ACHIEVEMENTS
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <FlatList
        data={sortedAchievements}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: GRID_PADDING,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 8 }}>
            <StatsHeader achievements={achievements} />
            <CategoriesFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </View>
        }
        renderItem={({ item }) => <AchievementCard achievement={item} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
            <View
              style={[
                {
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: "#134c39",
                  borderWidth: 2,
                  borderColor: "#2a7a60",
                  alignItems: "center",
                  justifyContent: "center",
                },
                pillShadow.sm,
              ]}
            >
              <Ionicons name="trophy-outline" size={32} color="#6e9e8a" />
            </View>
            <Text style={{ color: "#6e9e8a", fontSize: 14 }}>
              No achievements in this category
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
