import { useLocalSearchParams, router } from "expo-router";
import { View, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getDeck } from "@/services/decks.api";
import LoadingScreen from "../components/LoadingScreen";
import DeckDetailHeader from "../components/decks/details/DeckDetailsHeader";
import DeckStats from "../components/decks/details/DeckStats";
import EmptyCard from "../components/cards/EmptyCard";
import CardItem from "../components/cards/CardItem";
import DeckActions from "../components/decks/details/DeckActions";

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();

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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <DeckDetailHeader
        name={deck.name}
        cardCount={deck.cards?.length || 0}
        onBack={() => router.back()}
      />

      {hasCards && <DeckStats cards={deck.cards} />}

      <FlatList
        data={deck.cards || []}
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

      {hasCards && <DeckActions deckId={Number(id)} hasCards={hasCards} />}
    </SafeAreaView>
  );
}
