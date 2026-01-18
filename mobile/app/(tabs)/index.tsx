"use client";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/services/auth_context";
import { Deck } from "@/types";
import { fetchDecks } from "@/services/decks.api";

export default function HomeScreen() {
  const { user } = useAuth();

  const {
    data: decks = [],
    isLoading,
    refetch,
  } = useQuery<Deck[]>({
    queryKey: ["decks"],
    queryFn: fetchDecks,
    enabled: !!user,
  });

  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0);

  const recentDecks = decks.slice(0, 3);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.username || "Learner"}!
        </Text>
        <Text style={styles.subtitle}>Ready to learn today?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{decks.length}</Text>
          <Text style={styles.statLabel}>Decks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCards}</Text>
          <Text style={styles.statLabel}>Cards</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Decks</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentDecks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No decks yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.createButtonText}>
                Create Your First Deck
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentDecks.map((deck) => (
            <TouchableOpacity
              key={deck.id}
              style={styles.deckCard}
              onPress={() => router.push(`/`)}
            >
              <Text style={styles.deckTitle}>{deck.name}</Text>
              <Text style={styles.deckInfo}>{deck.cardCount} cards</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.trainButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.trainButtonText}>Start Training</Text>
      </TouchableOpacity>
    </ScrollView>
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
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  seeAll: {
    color: "#3b82f6",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
  },
  deckCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deckTitle: {
    fontWeight: "600",
  },
  deckInfo: {
    color: "#64748b",
  },
  trainButton: {
    backgroundColor: "#3b82f6",
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  trainButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
