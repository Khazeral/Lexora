import { View, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getDecks } from "@/services/decks.api";
import { Deck } from "@/types";
import LoadingScreen from "../components/LoadingScreen";
import TrainHeader from "../components/train/TrainHeader";
import TrainDeckCard from "../components/train/TrainDeckCard";
import EmptyTrainDecks from "../components/train/EmptyTrainDeck";
import EmptyTrainNoCards from "../components/train/EmptyTrainNoCards";
import Scanlines from "../components/Scanlines";

export default function TrainScreen() {
  const { data: decks = [], isLoading } = useQuery<Deck[]>({
    queryKey: ["decks"],
    queryFn: getDecks,
  });

  const sortedDecks = [...decks].sort((a, b) => {
    if (a.cardCount > 0 && b.cardCount <= 0) return -1;
    if (a.cardCount <= 0 && b.cardCount > 0) return 1;
    return b.cardCount - a.cardCount;
  });

  const decksWithCards = sortedDecks.filter((d) => d.cardCount > 0);
  const hasDecksButNoCards = decks.length > 0 && decksWithCards.length === 0;

  if (isLoading) {
    return <LoadingScreen loading />;
  }

  return (
    <View className="flex-1 bg-background">
      <Scanlines />
      <TrainHeader />

      <FlatList
        data={decksWithCards}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          hasDecksButNoCards ? <EmptyTrainNoCards /> : <EmptyTrainDecks />
        }
        renderItem={({ item }) => <TrainDeckCard deck={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}
