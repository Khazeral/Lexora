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

type GameMode = "classic" | "speedrun" | "streak" | "timeattack" | "perfect";

interface ModeConfig {
  id: GameMode;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  difficultyColor: string;
}

const GAME_MODES: ModeConfig[] = [
  {
    id: "classic",
    title: "Classic Mode",
    description: "Standard flashcard practice at your own pace",
    icon: "albums",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    difficulty: "Easy",
    difficultyColor: "#10b981",
  },
  {
    id: "speedrun",
    title: "Speed Run ⚡",
    description:
      "Complete all cards as fast as possible. Wrong answers add +5s penalty",
    icon: "flash",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    difficulty: "Medium",
    difficultyColor: "#f59e0b",
  },
  {
    id: "streak",
    title: "Streak Master 🔥",
    description: "Build the longest streak without mistakes. 3 lives only!",
    icon: "flame",
    color: "#ef4444",
    bgColor: "#fee2e2",
    difficulty: "Hard",
    difficultyColor: "#ef4444",
  },
  {
    id: "timeattack",
    title: "Time Attack 🎯",
    description: "10 seconds per card. Time's up = wrong answer!",
    icon: "timer",
    color: "#8b5cf6",
    bgColor: "#f3e8ff",
    difficulty: "Hard",
    difficultyColor: "#ef4444",
  },
  {
    id: "perfect",
    title: "Perfect Run 💎",
    description: "Zero mistakes allowed. One error = restart from beginning",
    icon: "diamond",
    color: "#ec4899",
    bgColor: "#fce7f3",
    difficulty: "Expert",
    difficultyColor: "#7c3aed",
  },
];

export default function TrainingSettingsScreen() {
  const { id } = useLocalSearchParams();
  const [shuffleCards, setShuffleCards] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("classic");

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
        gameMode: gameMode,
      },
    });
  };

  const selectedMode = GAME_MODES.find((m) => m.id === gameMode)!;

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.deckInfo}>
          <Ionicons name="albums" size={32} color="#3b82f6" />
          <View style={styles.deckDetails}>
            <Text style={styles.deckName}>{deck?.name}</Text>
            <Text style={styles.deckCards}>
              {deck?.cards.length || 0} cards
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Mode</Text>
          <Text style={styles.sectionSubtitle}>Choose your challenge</Text>

          {GAME_MODES.map((mode) => (
            <View key={mode.id}>
              <TouchableOpacity
                style={[
                  styles.modeCard,
                  gameMode === mode.id && styles.modeCardActive,
                  {
                    borderColor:
                      gameMode === mode.id ? mode.color : "transparent",
                  },
                ]}
                onPress={() => setGameMode(mode.id)}
              >
                <View
                  style={[styles.modeIcon, { backgroundColor: mode.bgColor }]}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={28}
                    color={mode.color}
                  />
                </View>
                <View style={styles.modeInfo}>
                  <View style={styles.modeTitleRow}>
                    <Text style={styles.modeTitle}>{mode.title}</Text>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: mode.bgColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          { color: mode.difficultyColor },
                        ]}
                      >
                        {mode.difficulty}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
                {gameMode === mode.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={mode.color}
                  />
                )}
              </TouchableOpacity>

              {/* Options for Classic Mode */}
              {mode.id === "classic" && gameMode === "classic" && (
                <View style={styles.classicOptions}>
                  <View style={styles.optionRow}>
                    <View style={styles.optionLeft}>
                      <Ionicons name="shuffle" size={20} color="#3b82f6" />
                      <View style={styles.optionTextInline}>
                        <Text style={styles.optionTitleInline}>
                          Shuffle Cards
                        </Text>
                        <Text style={styles.optionDescriptionInline}>
                          Randomize order
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

                  <View style={styles.optionDivider} />

                  <View style={styles.optionRow}>
                    <View style={styles.optionLeft}>
                      <Ionicons
                        name="swap-horizontal"
                        size={20}
                        color="#10b981"
                      />
                      <View style={styles.optionTextInline}>
                        <Text style={styles.optionTitleInline}>
                          Reverse Mode
                        </Text>
                        <Text style={styles.optionDescriptionInline}>
                          Translation first
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
              )}
            </View>
          ))}
        </View>

        {/* Mode-specific tips */}
        <View
          style={[
            styles.tipsCard,
            {
              backgroundColor: selectedMode.bgColor,
              borderColor: selectedMode.color + "40",
            },
          ]}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={selectedMode.color}
          />
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, { color: selectedMode.color }]}>
              💡 {selectedMode.title} Tips
            </Text>
            <Text style={[styles.tipsText, { color: selectedMode.color }]}>
              {gameMode === "classic" &&
                "• Take your time\n• Review wrong answers\n• Practice regularly for best results"}
              {gameMode === "speedrun" &&
                "• Focus on speed AND accuracy\n• Wrong answers cost 5 seconds\n• Beat your personal record!"}
              {gameMode === "streak" &&
                "• One mistake = game over\n• You have 3 lives\n• Stay focused and calm"}
              {gameMode === "timeattack" &&
                "• 10 seconds per card\n• Think fast but accurately\n• Time pressure builds skills"}
              {gameMode === "perfect" &&
                "• Zero tolerance for errors\n• One mistake = restart\n• Only for true masters"}
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: selectedMode.color }]}
          onPress={handleStart}
          disabled={!deck || deck.cards.length === 0}
        >
          <Text style={styles.startButtonText}>
            Start {selectedMode.title.split(" ")[0]}
          </Text>
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
    paddingHorizontal: 16,
    marginBottom: 8,
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
    padding: 12,
    borderRadius: 16,
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
    shadowColor: "#3b82f6",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  modeIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modeDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  classicOptions: {
    backgroundColor: "#f8fafc",
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#3b82f6",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  optionDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  optionTextInline: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitleInline: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  optionDescriptionInline: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 1,
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
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
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
