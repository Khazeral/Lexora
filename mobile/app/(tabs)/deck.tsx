// app/(tabs)/deck.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getDecks } from "@/services/decks.api";
import { Deck } from "@/types";

export default function DecksScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: decks = [],
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["decks"],
    queryFn: getDecks,
  });

  const filteredDecks = decks.filter((deck: Deck) =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const showEmptyState = !isLoading && filteredDecks.length === 0;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#5b8af5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-16 pb-4 border-b-2 border-border">
        <Text className="text-foreground text-2xl font-bold tracking-wider">
          {t("decks.title").toUpperCase()}
        </Text>
      </View>

      {/* Search Bar */}
      {decks.length > 0 && (
        <View className="px-5 py-3">
          <View className="flex-row items-center bg-card rounded-xl px-4 py-3 border-2 border-border">
            <Ionicons name="search" size={20} color="#7a8da8" />
            <TextInput
              className="flex-1 ml-3 text-foreground text-base"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t("decks.search")}
              placeholderTextColor="#7a8da8"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#7a8da8" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Decks List */}
      <FlatList
        data={filteredDecks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        onRefresh={refetch}
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          showEmptyState ? (
            <EmptyDecks hasSearchQuery={searchQuery.length > 0} />
          ) : null
        }
        renderItem={({ item, index }) => (
          <DeckListItem deck={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />

      {/* FAB Create Button */}
      <TouchableOpacity
        className="absolute right-5 bottom-5 flex-row items-center gap-2 px-5 py-4 bg-primary rounded-2xl border-2 border-primary/60"
        style={glowStyles.blueButton}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text className="text-white font-bold tracking-wider">
          {t("decks.create")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Glow styles
const glowStyles = StyleSheet.create({
  blue: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  blueButton: {
    shadowColor: "#5b8af5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  purple: {
    shadowColor: "#b08dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  green: {
    shadowColor: "#44d9a0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  pink: {
    shadowColor: "#f472b6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  gold: {
    shadowColor: "#f5c542",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

const deckColors = [
  { bg: "#5b8af5", glow: glowStyles.blue },
  { bg: "#b08dff", glow: glowStyles.purple },
  { bg: "#44d9a0", glow: glowStyles.green },
  { bg: "#f472b6", glow: glowStyles.pink },
  { bg: "#f5c542", glow: glowStyles.gold },
];

type DeckListItemProps = {
  deck: Deck;
  index: number;
};

function DeckListItem({ deck, index }: DeckListItemProps) {
  const { t } = useTranslation();
  const colorConfig = deckColors[index % deckColors.length];
  const cardCount = deck.cards?.length || 0;

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-xl bg-card border-2 border-border"
      onPress={() => router.push(`/deck/${deck.id}`)}
      activeOpacity={0.7}
    >
      <View
        className="w-14 h-14 rounded-xl items-center justify-center border-2 border-white/10"
        style={[{ backgroundColor: colorConfig.bg }, colorConfig.glow]}
      >
        <Ionicons name="albums" size={28} color="#fff" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-foreground font-bold tracking-wider text-base uppercase">
          {deck.name}
        </Text>
        <Text className="text-muted-foreground text-sm font-semibold mt-1">
          {cardCount} {cardCount === 1 ? "carte" : "cartes"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#7a8da8" />
    </TouchableOpacity>
  );
}

type EmptyDecksProps = {
  hasSearchQuery: boolean;
};

function EmptyDecks({ hasSearchQuery }: EmptyDecksProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center py-12">
      <View className="w-20 h-20 rounded-full bg-card border-2 border-border items-center justify-center mb-4">
        <Ionicons
          name={hasSearchQuery ? "search" : "albums-outline"}
          size={40}
          color="#7a8da8"
        />
      </View>
      <Text className="text-foreground text-lg font-bold mb-2">
        {hasSearchQuery ? t("decks.noResults") : t("decks.empty.title")}
      </Text>
      <Text className="text-muted-foreground text-sm text-center px-8">
        {hasSearchQuery
          ? t("decks.tryDifferentSearch")
          : t("decks.empty.subtitle")}
      </Text>
      {!hasSearchQuery && (
        <TouchableOpacity
          className="flex-row items-center gap-2 px-6 py-3 bg-primary rounded-xl border-2 border-primary/60 mt-6"
          onPress={() => router.push("/deck/create")}
          activeOpacity={0.8}
          style={glowStyles.blue}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text className="text-white font-bold tracking-wider">
            {t("decks.createFirst")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
