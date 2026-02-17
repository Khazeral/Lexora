import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/decks.api";
import { useState, useCallback } from "react";
import HomeHeader from "../components/home/HomeHeader";
import QuickStats from "../components/home/QuickStats";
import RecentDecksSection from "../components/home/RecentDecksSection";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#5b8af5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
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

        <QuickStats
          totalDecks={homeData?.totalDecks || 0}
          totalCards={homeData?.totalCards || 0}
          isLoading={isLoading}
        />
        <RecentDecksSection decks={homeData?.recentDecks || []} />

        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
