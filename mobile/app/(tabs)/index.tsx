import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/decks.api";
import { useState, useCallback } from "react";
import HomeHeader from "../components/Header";
import QuickStats from "../components/home/QuickStats";
import DailyGoal from "../components/home/DailyGoal";
import RecentDecksSection from "../components/home/RecentDecksSection";
import QuickActions from "../components/home/QuickActions";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: homeData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["home"],
    queryFn: getHomeData,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <HomeHeader username={user?.username || ""} />
      <QuickStats
        totalDecks={homeData?.totalDecks || 0}
        totalCards={homeData?.totalCards || 0}
        streak={user?.currentStreak || 0}
        isLoading={isLoading}
      />
      <DailyGoal
        completedToday={homeData?.completedToday || 0}
        dailyGoal={10}
      />
      <QuickActions />
      <RecentDecksSection
        decks={homeData?.recentDecks || []}
        isLoading={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
