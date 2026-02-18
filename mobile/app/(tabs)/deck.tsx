import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getDecks } from "@/services/decks.api";
import { Deck } from "@/types";
import { pillShadow } from "@/app/components/ui/GlowStyles";
import DecksHeader from "@/app/components/decks/DecksHeader";
import DecksSearchBar from "@/app/components/decks/DecksSearchBar";
import EmptyDecks from "../components/decks/EmptyDeck";
import DeckListItem from "../components/decks/DeckListItem";

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
        <ActivityIndicator size="large" color="#e8453c" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <DecksHeader />

      {decks.length > 0 && (
        <DecksSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("decks.search")}
        />
      )}

      <FlatList
        data={filteredDecks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
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
        ItemSeparatorComponent={() => <View className="h-5" />}
      />

      {/* FAB Create Button */}
      <TouchableOpacity
        className="absolute right-6 bottom-8 flex-row items-center gap-2 px-6 py-4 rounded-2xl bg-info"
        style={pillShadow.default}
        onPress={() => router.push("/deck/create")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text className="text-white font-bold tracking-wider text-base">
          {t("decks.create").toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
