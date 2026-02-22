import { View, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDecks } from "@/services/decks.api";
import { Deck } from "@/types";
import LoadingScreen from "../components/LoadingScreen";
import TrainHeader from "../components/train/TrainHeader";
import TrainDeckCard from "../components/train/TrainDeckCard";
import EmptyTrainDecks from "../components/train/EmptyTrainDeck";
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

  if (isLoading) {
    return <LoadingScreen loading />;
  }

  return (
    <View className="flex-1 bg-background">
      <Scanlines />
      <TrainHeader />

      <FlatList
        data={sortedDecks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyTrainDecks />}
        renderItem={({ item }) => <TrainDeckCard deck={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}
