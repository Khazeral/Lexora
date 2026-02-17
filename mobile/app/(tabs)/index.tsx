import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/decks.api";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
        {/* Header */}
        <View className="px-5 pt-16 pb-4">
          <View className="flex-row items-center gap-3">
            <View
              className="w-12 h-12 bg-primary rounded-xl items-center justify-center border-2 border-primary/60"
              style={glowStyles.blue}
            >
              <Text className="text-2xl font-bold text-white">言</Text>
            </View>
            <View>
              <Text className="text-foreground text-lg font-bold tracking-widest">
                LEXUP
              </Text>
              <Text className="text-accent text-[10px] font-bold tracking-[3px]">
                LEARN VOCABULARY
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Banner */}
        <View className="mx-5 bg-card rounded-2xl p-5 border-2 border-border">
          <View className="flex-row gap-4">
            {/* Decks stat */}
            <View className="flex-1 bg-secondary/80 rounded-xl px-4 py-4 items-center border-2 border-border">
              <View className="w-10 h-10 bg-primary/20 rounded-lg items-center justify-center border border-primary/30 mb-2">
                <Ionicons name="albums" size={20} color="#5b8af5" />
              </View>
              <Text className="text-3xl font-bold text-foreground">
                {homeData?.totalDecks || 0}
              </Text>
              <Text className="text-[10px] text-muted-foreground font-bold tracking-widest">
                DECKS
              </Text>
            </View>
            {/* Cards stat */}
            <View className="flex-1 bg-secondary/80 rounded-xl px-4 py-4 items-center border-2 border-border">
              <View className="w-10 h-10 bg-success/20 rounded-lg items-center justify-center border border-success/30 mb-2">
                <Ionicons name="layers" size={20} color="#44d9a0" />
              </View>
              <Text className="text-3xl font-bold text-foreground">
                {homeData?.totalCards || 0}
              </Text>
              <Text className="text-[10px] text-muted-foreground font-bold tracking-widest">
                CARTES
              </Text>
            </View>
          </View>
        </View>

        {/* Level Filter */}
        <View className="mt-6 px-5">
          <Text className="text-[10px] font-bold text-muted-foreground tracking-[3px] mb-3">
            NIVEAU
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {/* Selected level - with glow */}
              <TouchableOpacity
                className="px-4 py-2.5 rounded-lg bg-primary border-2 border-primary/60"
                style={glowStyles.blue}
              >
                <Text className="text-xs font-bold text-white tracking-widest">
                  TOUS
                </Text>
              </TouchableOpacity>
              {["N5", "N4", "N3", "N2", "N1"].map((level) => (
                <TouchableOpacity
                  key={level}
                  className="px-4 py-2.5 rounded-lg bg-card border-2 border-border flex-row items-center gap-1.5"
                >
                  <Text className="text-xs font-bold text-foreground tracking-widest">
                    {level}
                  </Text>
                  <Text className="text-xs text-muted-foreground">0</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Decks Section */}
        <View className="mt-6 px-5">
          <Text className="text-[10px] font-bold text-muted-foreground tracking-[3px] mb-3">
            DECKS
          </Text>

          {/* All Decks Card - with glow when active */}
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-xl bg-card border-2 border-primary/50 mb-2.5"
            onPress={() => router.push("/(tabs)/deck")}
            activeOpacity={0.7}
            style={glowStyles.blueSubtle}
          >
            <View
              className="w-12 h-12 rounded-lg bg-primary items-center justify-center border-2 border-white/10"
              style={glowStyles.blueSm}
            >
              <Ionicons name="grid" size={24} color="#fff" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-foreground font-bold tracking-wider text-sm">
                ALL DECKS
              </Text>
              <Text className="text-muted-foreground text-xs font-semibold">
                {homeData?.totalCards || 0} cartes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#7a8da8" />
          </TouchableOpacity>

          {/* Recent Decks */}
          {homeData?.recentDecks?.length > 0 ? (
            homeData.recentDecks.map((deck, index) => (
              <DeckCard key={deck.id} deck={deck} index={index} />
            ))
          ) : (
            <EmptyState />
          )}
        </View>

        {/* Bottom spacing for play button */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-card/95 border-t-2 border-border">
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 px-6 bg-primary rounded-xl border-2 border-primary/60"
          onPress={() => router.push("/(tabs)/train")}
          activeOpacity={0.8}
          style={glowStyles.blueButton}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text className="text-white font-bold text-lg tracking-widest ml-2">
            PLAY
          </Text>
          <View className="ml-3 px-3 py-1 bg-white/15 rounded-lg border border-white/10">
            <Text className="text-white text-sm font-bold">
              {homeData?.totalCards || 0}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Glow styles
const glowStyles = StyleSheet.create({
  blue: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  blueSm: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  blueSubtle: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  blueButton: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  gold: {
    shadowColor: "#f5c542",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  green: {
    shadowColor: "#44d9a0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  pink: {
    shadowColor: "#f472b6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  purple: {
    shadowColor: "#b08dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});

// Category colors matching KotobaCards
const deckColors = [
  { bg: "#5b8af5", glow: glowStyles.blue },
  { bg: "#b08dff", glow: glowStyles.purple },
  { bg: "#44d9a0", glow: glowStyles.green },
  { bg: "#f472b6", glow: glowStyles.pink },
  { bg: "#f5c542", glow: glowStyles.gold },
];

type DeckCardProps = {
  deck: { id: number; name: string; cardCount: number };
  index: number;
};

function DeckCard({ deck, index }: DeckCardProps) {
  const colorConfig = deckColors[index % deckColors.length];

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-xl bg-card border-2 border-border mb-2.5"
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      <View
        className="w-12 h-12 rounded-lg items-center justify-center border-2 border-white/10"
        style={[{ backgroundColor: colorConfig.bg }, colorConfig.glow]}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-sm uppercase">
          {deck.name}
        </Text>
        <Text className="text-muted-foreground text-xs font-semibold">
          {deck.cardCount} cartes
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#7a8da8" />
    </TouchableOpacity>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <View className="items-center py-8 rounded-xl bg-card border-2 border-border">
      <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center mb-4">
        <Ionicons name="albums-outline" size={32} color="#7a8da8" />
      </View>
      <Text className="text-foreground text-base font-bold mb-1">
        {t("home.recentDecks.noDecksTitle")}
      </Text>
      <Text className="text-muted-foreground text-sm mb-4">
        {t("home.recentDecks.noDecksSubtitle")}
      </Text>
      <TouchableOpacity
        className="flex-row items-center gap-2 px-5 py-3 bg-primary rounded-xl border-2 border-primary/60"
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
        style={glowStyles.blue}
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text className="text-white font-bold tracking-wider">
          {t("home.recentDecks.createFirst")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
