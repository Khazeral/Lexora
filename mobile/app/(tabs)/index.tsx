import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/decks.api";
import { useState, useCallback } from "react";
import HomeHeader from "../components/home/HomeHeader";
import RecentDecksSection from "../components/home/RecentDecksSection";
import Scanlines from "../components/Scanlines";

export default function HomeScreen() {
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

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#5b8af5" />
      </View>
    );
  }

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

        <RecentDecksSection decks={homeData?.recentDecks || []} />

        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
