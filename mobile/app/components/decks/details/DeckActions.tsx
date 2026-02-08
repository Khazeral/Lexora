import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type DeckActionsProps = {
  deckId: number;
  hasCards: boolean;
};

export default function DeckActions({ deckId, hasCards }: DeckActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/deck/${deckId}/add-card`)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>
          {t("decks.deckDetail.addCard")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    position: "absolute",
    right: 20,
    bottom: 20,
    gap: 12,
    alignItems: "flex-end",
  },
  studyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  studyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
