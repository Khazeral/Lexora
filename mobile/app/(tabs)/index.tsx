import { StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/decks.api";
import Header from "../components/Header";
import StatsSection from "../components/home/StatsSection";
import RecentDecksSection from "../components/home/RecentDecksSection";

export default function HomeScreen() {
  const { user } = useAuth();

  const { data: homeData, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: getHomeData,
  });

  return (
    <ScrollView style={styles.container}>
      <Header username={user?.username || ""} />

      <StatsSection
        totalDecks={homeData?.totalDecks || 0}
        totalCards={homeData?.totalCards || 0}
        isLoading={isLoading}
      />

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
