import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams();

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!deck) {
    return (
      <View style={styles.center}>
        <Text>Deck not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{deck.name}</Text>
          <Text style={styles.cardCount}>{deck.cards.length} cards</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={deck.cards}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="albums-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Cards Yet</Text>
            <Text style={styles.emptyText}>
              Add your first card to start learning
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/card/${item.id}`)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.translation}>{item.translation}</Text>
            </View>
            {item.progress && (
              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>
                  {item.progress.status || "bronze"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/deck/${id}/add-card`)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardCount: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  translation: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  progressBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "capitalize",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
