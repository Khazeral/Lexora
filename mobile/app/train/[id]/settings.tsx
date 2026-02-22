import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getDeck } from "@/services/decks.api";
import { GAME_MODES, GameMode } from "@/constants/gameMods";
import LoadingScreen from "@/app/components/LoadingScreen";
import TrainSettingsHeader from "@/app/components/train/settings/TrainSettingsHeader";
import GameModeSelector from "@/app/components/train/settings/GameModeSelector";
import { StartTrainingButton } from "@/app/components/train/settings/StartTrainingButton";
import Scanlines from "@/app/components/Scanlines";

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
    <View className="flex-1 bg-background">
      <Scanlines />
      <TrainSettingsHeader onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
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
    </View>
  );
}
