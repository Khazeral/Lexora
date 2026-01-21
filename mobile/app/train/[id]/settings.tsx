import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { Ionicons } from "@expo/vector-icons";

//type GameMode = "flashcards" | "quiz" | "matching";

export default function TrainingSettingsScreen() {
  const { id } = useLocalSearchParams();
  const [shuffleCards, setShuffleCards] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  //const [gameMode, setGameMode] = useState<GameMode>("flashcards");

  const { data: deck } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  const handleStart = () => {
    router.push({
      pathname: "/train/[id]/session",
      params: {
        id,
        isShuffle: shuffleCards ? "true" : "false",
        isReverse: reverseMode ? "true" : "false",
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Training Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.deckInfo}>
          <Ionicons name="albums" size={32} color="#3b82f6" />
          <View style={styles.deckDetails}>
            <Text style={styles.deckName}>{deck?.name}</Text>
            <Text style={styles.deckCards}>
              {deck?.cards.length || 0} cards
            </Text>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Mode</Text>
          <Text style={styles.sectionSubtitle}>
            Choose how you want to practice
          </Text>

          <TouchableOpacity
            style={[
              styles.modeCard,
              gameMode === "flashcards" && styles.modeCardActive,
            ]}
            onPress={() => setGameMode("flashcards")}
          >
            <View style={styles.modeIcon}>
              <Ionicons
                name="card"
                size={28}
                color={gameMode === "flashcards" ? "#3b82f6" : "#64748b"}
              />
            </View>
            <View style={styles.modeInfo}>
              <Text
                style={[
                  styles.modeTitle,
                  gameMode === "flashcards" && styles.modeTextActive,
                ]}
              >
                Flashcards
              </Text>
              <Text style={styles.modeDescription}>
                Flip cards to reveal answers
              </Text>
            </View>
            {gameMode === "flashcards" && (
              <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeCard,
              gameMode === "quiz" && styles.modeCardActive,
            ]}
            onPress={() => setGameMode("quiz")}
          >
            <View style={styles.modeIcon}>
              <Ionicons
                name="help-circle"
                size={28}
                color={gameMode === "quiz" ? "#10b981" : "#64748b"}
              />
            </View>
            <View style={styles.modeInfo}>
              <Text
                style={[
                  styles.modeTitle,
                  gameMode === "quiz" && styles.modeTextActive,
                ]}
              >
                Quiz Mode
              </Text>
              <Text style={styles.modeDescription}>
                Multiple choice questions
              </Text>
            </View>
            {gameMode === "quiz" && (
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeCard,
              gameMode === "matching" && styles.modeCardActive,
              styles.modeCardDisabled,
            ]}
            disabled
          >
            <View style={styles.modeIcon}>
              <Ionicons name="git-merge" size={28} color="#94a3b8" />
            </View>
            <View style={styles.modeInfo}>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
              <Text style={[styles.modeTitle, styles.modeTextDisabled]}>
                Matching Game
              </Text>
              <Text style={styles.modeDescription}>
                Match terms with definitions
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <Ionicons name="shuffle" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.optionTitle}>Shuffle Cards</Text>
                <Text style={styles.optionDescription}>
                  Randomize the order of cards
                </Text>
              </View>
            </View>
            <Switch
              value={shuffleCards}
              onValueChange={setShuffleCards}
              trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
              thumbColor={shuffleCards ? "#3b82f6" : "#f4f3f4"}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <Ionicons name="swap-horizontal" size={24} color="#10b981" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Reverse Mode</Text>
                <Text style={styles.optionDescription}>
                  Show translation first, guess the word
                </Text>
              </View>
            </View>
            <Switch
              value={reverseMode}
              onValueChange={setReverseMode}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={reverseMode ? "#10b981" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>💡 Training Tips</Text>
            <Text style={styles.tipsText}>
              • Shuffle cards to improve memory retention{"\n"}• Use reverse
              mode to practice in both directions{"\n"}• Take breaks every 15-20
              cards for better results
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          disabled={!deck || deck.cards.length === 0}
        >
          <Text style={styles.startButtonText}>Start Training</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  deckInfo: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deckDetails: {
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
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  modeCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  modeCardDisabled: {
    opacity: 0.5,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  modeTextActive: {
    color: "#3b82f6",
  },
  modeTextDisabled: {
    color: "#94a3b8",
  },
  modeDescription: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  comingSoonBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#92400e",
    textTransform: "uppercase",
  },
  optionCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  optionDescription: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: "#eff6ff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  startButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
