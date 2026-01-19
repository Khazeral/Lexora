"use client";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getDecks } from "@/services/decks.api";
import { Link, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DecksScreen() {
  const {
    data: decks = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["decks"],
    queryFn: getDecks,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="albums-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No Decks Yet</Text>
            <Text style={styles.emptyText}>
              Create your first deck to start learning
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/deck/${item.id}` as Href} asChild>
            <TouchableOpacity style={styles.deckCard}>
              <View style={styles.deckInfo}>
                <Text style={styles.deckTitle}>{item.name}</Text>
                <Text style={styles.deckMeta}>{item.cardCount} cards</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </Link>
        )}
      />

      <Link href="/deck/create" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  list: { padding: 16, paddingBottom: 100 },
  deckCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deckInfo: { flex: 1 },
  deckTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b" },
  deckMeta: { fontSize: 13, color: "#94a3b8", marginTop: 8 },
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
