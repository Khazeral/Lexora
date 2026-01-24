import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getDecks } from "@/services/decks.api";
import DecksHeader from "../components/decks/DecksHeader";
import DecksSearchBar from "../components/decks/DecksSearchBar";
import EmptyDecks from "../components/decks/EmptyDeck";
import DeckCard from "../components/decks/DeckCard";
import CreateDeckButton from "../components/decks/create-deck/CreateDeckButton";
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          showEmptyState ? (
            <EmptyDecks hasSearchQuery={searchQuery.length > 0} />
          ) : null
        }
        renderItem={({ item }) => <DeckCard deck={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <CreateDeckButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
});
