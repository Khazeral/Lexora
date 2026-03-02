import { useLocalSearchParams, router } from "expo-router";
import { View, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getDeck } from "@/services/decks.api";
import LoadingScreen from "../components/LoadingScreen";
import DeckDetailHeader from "../components/decks/details/DeckDetailsHeader";
import EmptyCard from "../components/cards/EmptyCard";
import CardItem from "../components/cards/CardItem";
import DeckActions from "../components/decks/details/DeckActions";
import Scanlines from "../components/Scanlines";
import DecksSearchBar from "../components/decks/DecksSearchBar";
import { useState } from "react";
import { Card } from "@/types";

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  if (isLoading) {
    return <LoadingScreen loading />;
  }

  if (!deck) {
    return (
      <LoadingScreen
        notFound
        notFoundMessage={t("decks.deckDetail.notFound")}
        notFoundIcon="albums-outline"
      />
    );
  }

  const hasCards = deck.cards && deck.cards.length > 0;

  const filteredDecks = deck.cards.filter(
    (card: Card) =>
      card.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.translation.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Scanlines />
      <DeckDetailHeader
        name={deck.name}
        cardCount={deck.cards?.length || 0}
        onBack={() => router.back()}
      />

      {hasCards && (
        <DecksSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("decks.deckDetail.search")}
        />
      )}
      <FlatList
        data={filteredDecks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-6 pb-28 flex-grow"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyCard deckId={Number(id)} />}
        renderItem={({ item }) => (
          <CardItem
            card={item}
            onPress={() => router.push(`/card/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />

      {hasCards && <DeckActions deckId={Number(id)} />}
    </SafeAreaView>
  );
}
