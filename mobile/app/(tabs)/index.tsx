import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/decks.api";
import { getAchievements } from "@/services/achievements.api";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import HomeHeader from "../components/home/HomeHeader";
import RecentDecksSection from "../components/home/RecentDecksSection";
import Scanlines from "../components/Scanlines";
import HomeEmpty from "../components/home/HomeEmpty";
import { pillShadow } from "../components/ui/GlowStyles";
import AnimatedTouchable from "../components/ui/AnimatedTouchable";
import { getAchievementName } from "@/utils/achievementsUtils";

const RARITY_COLORS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  common: { bg: "#1a3d2e", text: "#44d9a0", icon: "#44d9a0" },
  rare: { bg: "#1a3a5c", text: "#5b8af5", icon: "#5b8af5" },
  epic: { bg: "#2e1a3d", text: "#b08dff", icon: "#b08dff" },
  legendary: { bg: "#3d2e1a", text: "#f5c542", icon: "#f5c542" },
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const {
    data: homeData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["home"],
    queryFn: getHomeData,
  });

  const { data: achievements = [], refetch: refetchAchievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchAchievements()]);
    setRefreshing(false);
  }, [refetch, refetchAchievements]);

  const recentUnlocked = achievements
    .filter((a) => a.unlocked && a.unlockedAt)
    .sort(
      (a, b) =>
        new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime(),
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#5b8af5" />
      </View>
    );
  }

  const hasDecks = homeData?.recentDecks && homeData.recentDecks.length > 0;

  return (
    <View className="flex-1 bg-background">
      <Scanlines />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5b8af5"
          />
        }
      >
        <HomeHeader />

        {hasDecks ? (
          <>
            {homeData?.lastPlayedDeck && (
              <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                <Text className="text-sm text-white font-semibold tracking-[3px] mb-4">
                  {t("home.continueTraining.title").toUpperCase()}
                </Text>
                <AnimatedTouchable
                  onPress={() =>
                    router.push({
                      pathname: "/train/[id]/settings",
                      params: { id: homeData.lastPlayedDeck!.id },
                    })
                  }
                  activeOpacity={0.8}
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#134c39",
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: "#44d9a0",
                      padding: 16,
                      gap: 14,
                    },
                    pillShadow.sm,
                  ]}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: "#1a3d2e",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: "#44d9a0",
                    }}
                  >
                    <Ionicons name="play" size={22} color="#44d9a0" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#e8edf5",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                      numberOfLines={1}
                    >
                      {homeData.lastPlayedDeck.name}
                    </Text>
                    <Text
                      style={{ color: "#90c0ac", fontSize: 12, marginTop: 2 }}
                    >
                      {homeData.lastPlayedDeck.cardCount}{" "}
                      {homeData.lastPlayedDeck.cardCount > 1
                        ? t("decks.card.cards_plural_short")
                        : t("decks.card.cards_short")}
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#44d9a0" />
                </AnimatedTouchable>
              </View>
            )}

            <RecentDecksSection decks={homeData!.recentDecks} />

            {recentUnlocked.length > 0 && (
              <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text className="text-sm text-white font-semibold tracking-[3px]">
                    {t("home.achievements.title").toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/achievements")}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        color: "#f5c542",
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      {t("home.achievements.seeAll")} →
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    {
                      backgroundColor: "#134c39",
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: "#2a7a60",
                      overflow: "hidden",
                    },
                    pillShadow.sm,
                  ]}
                >
                  {recentUnlocked.map((achievement, index) => {
                    const colors =
                      RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;

                    return (
                      <View key={achievement.id}>
                        <TouchableOpacity
                          onPress={() => router.push("/achievements")}
                          activeOpacity={0.7}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 14,
                            gap: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              backgroundColor: colors.bg,
                              alignItems: "center",
                              justifyContent: "center",
                              borderWidth: 1.5,
                              borderColor: colors.icon,
                            }}
                          >
                            <Ionicons
                              name={achievement.icon as any}
                              size={20}
                              color={colors.icon}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: "#e8edf5",
                                fontSize: 14,
                                fontWeight: "700",
                              }}
                              numberOfLines={1}
                            >
                              {getAchievementName(
                                achievement.code,
                                achievement.name,
                              )}
                            </Text>
                            <Text
                              style={{
                                color: "#90c0ac",
                                fontSize: 12,
                                marginTop: 1,
                              }}
                              numberOfLines={1}
                            >
                              {achievement.description}
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 6,
                              backgroundColor: colors.bg,
                            }}
                          >
                            <Text
                              style={{
                                color: colors.text,
                                fontSize: 9,
                                fontWeight: "800",
                                letterSpacing: 1,
                              }}
                            >
                              {achievement.rarity.toUpperCase()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        {index < recentUnlocked.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#2a7a60",
                              marginHorizontal: 14,
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        ) : (
          <HomeEmpty />
        )}

        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
