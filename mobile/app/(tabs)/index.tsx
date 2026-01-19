import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/services/auth_context";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getHomeData } from "@/services/decks.api";

export default function HomeScreen() {
  const { user } = useAuth();

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: getHomeData,
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{user?.username}! 👋</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="albums" size={32} color="#3b82f6" />
          <Text style={styles.statValue}>{homeData?.totalDecks || 0}</Text>
          <Text style={styles.statLabel}>Total Decks</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="card" size={32} color="#10b981" />
          <Text style={styles.statValue}>{homeData?.totalCards || 0}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>
      </View>

      {/* Recent Decks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Decks</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/deck")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {homeData?.recentDecks && homeData.recentDecks.length > 0 ? (
          homeData.recentDecks.map((deck: any) => (
            <TouchableOpacity
              key={deck.id}
              style={styles.deckCard}
              onPress={() => router.push(`/deck/${deck.id}`)}
            >
              <View style={styles.deckIcon}>
                <Ionicons name="albums" size={24} color="#3b82f6" />
              </View>
              <View style={styles.deckInfo}>
                <Text style={styles.deckName}>{deck.name}</Text>
                <Text style={styles.deckCards}>{deck.cardCount} cards</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="albums-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No decks yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/deck/create")}
            >
              <Text style={styles.createButtonText}>
                Create Your First Deck
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/deck/create")}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle" size={32} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>New Deck</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/train")}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="school" size={32} color="#10b981" />
            </View>
            <Text style={styles.actionText}>Practice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: 16,
    color: "#64748b",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  seeAll: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
  deckCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deckIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  deckCards: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 12,
    marginBottom: 16,
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
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
});
