import { View, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDecks } from "@/services/decks.api";
import { Deck } from "@/types";
import LoadingScreen from "../components/LoadingScreen";
import TrainHeader from "../components/train/TrainHeader";
import TrainDeckCard from "../components/train/TrainDeckCard";
import EmptyTrainDecks from "../components/train/EmptyTrainDeck";

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TrainHeader />

      <FlatList
        data={sortedDecks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyTrainDecks />}
        renderItem={({ item }) => <TrainDeckCard deck={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    paddingBottom: 32,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
});
