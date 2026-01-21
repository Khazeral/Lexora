import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getDecks } from "@/services/decks.api";
import { Deck } from "@/types";

export default function TrainScreen() {
  const { data: decks = [], isSuccess, isLoading } = useQuery<Deck[]>({
    queryKey: ["decks"],
    queryFn: getDecks,
  });

  const sortDecksByCardCount = (decks: Deck[]): Deck[] => {
    return [...decks].sort((a, b) => {
      if (a.cardCount > 0 && b.cardCount <= 0) return -1;
      if (a.cardCount <= 0 && b.cardCount > 0) return 1;
      return 0;
    });
  };

  const sortedDecks = sortDecksByCardCount(decks);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Choose a deck to practice</Text>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loaderText}>Loading decks...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>Choose a deck to practice</Text>
      </View>

      <FlatList
        data={sortedDecks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Decks Available</Text>
            <Text style={styles.emptyText}>
              Create a deck first to start practicing
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/deck/create")}
            >
              <Text style={styles.createButtonText}>Create Deck</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={item.cardCount > 0 ? styles.deckCard : styles.deckCardDisabled}
            disabled={item.cardCount === 0}
            onPress={() => router.push(`/train/${item.id}/settings`)}
            activeOpacity={item.cardCount > 0 ? 0.7 : 1}
          >
            <View style={styles.deckIcon}>
              <Ionicons name="school" size={32} color="#3b82f6" />
            </View>
            <View style={styles.deckInfo}>
              <Text style={styles.deckName}>{item.name}</Text>
              <Text style={styles.deckCards}>{item.cardCount} cards</Text>
            </View>
            {
              item.cardCount > 0 &&
              <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
            }
            
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  deckCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deckCardDisabled: {
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 0,
    opacity: 0.6,
  },
  deckIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  deckCards: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
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
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
});