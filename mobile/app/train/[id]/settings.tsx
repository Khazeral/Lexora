import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getDeck } from "@/services/decks.api";
import { GAME_MODES, GameMode } from "@/constants/gameMods";
import LoadingScreen from "@/app/components/LoadingScreen";
import TrainSettingsHeader from "@/app/components/train/settings/TrainSettingsHeader";
import DeckInfoCard from "@/app/components/train/settings/DeckInfoCard";
import GameModeSelector from "@/app/components/train/settings/GameModeSelector";
import { StartTrainingButton } from "@/app/components/train/settings/StartTrainingButton";

export default function TrainingSettingsScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const [shuffleCards, setShuffleCards] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("classic");

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  if (isLoading) {
    return <LoadingScreen loading />;
  }

  if (!deck) {
    return (
      <LoadingScreen
        notFound
        notFoundMessage={t("deckDetail.notFound")}
        notFoundIcon="albums-outline"
      />
    );
  }

  const selectedMode = GAME_MODES.find((m) => m.id === gameMode)!;

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TrainSettingsHeader onBack={() => router.back()} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DeckInfoCard deck={deck} />

        <GameModeSelector
          selectedMode={gameMode}
          onSelectMode={setGameMode}
          shuffleCards={shuffleCards}
          reverseMode={reverseMode}
          onShuffleChange={setShuffleCards}
          onReverseChange={setReverseMode}
        />
      </ScrollView>

      <StartTrainingButton
        mode={selectedMode}
        onStart={handleStart}
        disabled={deck.cards.length === 0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
