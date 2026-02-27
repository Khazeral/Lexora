import { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { answerCard, UnlockedAchievement } from "@/services/progress.api";
import { getDeckRecords, updateDeckRecords } from "@/services/deck_records.api";
import { useAuth } from "@/services/auth_context";
import { useToast } from "@/services/toast_context";
import { Card } from "@/types";
import { GameMode } from "@/constants/gameMods";
import { shuffle } from "@/utils/cardUtils";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/app/components/LoadingScreen";
import SessionHeader from "@/app/components/train/session/SessionHeader";
import SessionProgress from "@/app/components/train/session/SessionProgress";
import useSessionTimer from "@/hooks/useSessionTimer";
import useCardTimer from "@/hooks/useCardTimer";
import useSessionStats from "@/hooks/useSessionStats";
import useGameModeState from "@/hooks/useGameModeState";
import FlashCard from "@/app/components/train/session/FlashCard";
import Scanlines from "@/app/components/Scanlines";

export default function TrainingSessionScreen() {
  const {
    id,
    isShuffle,
    isReverse,
    gameMode = "classic",
  } = useLocalSearchParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showAchievementToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  const [pendingAchievements, setPendingAchievements] = useState<
    UnlockedAchievement[]
  >([]);

  const cardsRef = useRef<Card[]>([]);

  const {
    sessionCorrectRef,
    sessionIncorrectRef,
    bestStreakRef,
    recordCorrect,
    recordIncorrect,
    resetStats,
  } = useSessionStats();

  const { elapsedTime, timePenalty, addPenalty, stopTimer, getTotalTime } =
    useSessionTimer(gameMode as string, true);

  const {
    lives,
    livesRef,
    isPerfectRun,
    loseLife,
    failPerfectRun,
    resetGameState,
  } = useGameModeState(gameMode as string);

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  const answerMutation = useMutation({
    mutationFn: ({ cardId, success }: { cardId: number; success: boolean }) =>
      answerCard(user!.id, cardId, success),
    onSuccess: (response) => {
      if (
        response.unlockedAchievements &&
        response.unlockedAchievements.length > 0
      ) {
        setPendingAchievements((prev) => [
          ...prev,
          ...response.unlockedAchievements,
        ]);
      }
    },
  });

  const handleIncorrectRef = useRef<() => void>(() => {});

  const { cardTimeLeft, stopCardTimer, getTotalTimeUsed, resetTotalTime } =
    useCardTimer(gameMode as string, isFlipped, currentIndex, () =>
      handleIncorrectRef.current(),
    );

  useEffect(() => {
    resetStats();
    resetGameState();
    resetTotalTime();
    setCurrentIndex(0);
    setIsFlipped(false);
    setPendingAchievements([]);
  }, [id, resetGameState, resetStats, resetTotalTime]);

  useEffect(() => {
    if (!deck) return;

    const sessionCards =
      isShuffle === "true" ? shuffle(deck.cards) : deck.cards;
    setCards(sessionCards);
    cardsRef.current = sessionCards;
    setCurrentIndex(0);
  }, [deck, isShuffle]);

  const navigateToComplete = useCallback((params: Record<string, string>) => {
    router.replace({
      pathname: "/train/[id]/complete",
      params,
    });
  }, []);

  const finishSession = useCallback(async () => {
    stopTimer();
    stopCardTimer();

    const finalTime = gameMode === "speedrun" ? getTotalTime() : 0;
    const finalLives = livesRef.current;
    const currentCards = cardsRef.current;

    const totalTimeUsed = getTotalTimeUsed();
    const avgTimePerCard =
      currentCards.length > 0 ? totalTimeUsed / currentCards.length : 0;

    let previousRecords = null;
    try {
      previousRecords = await getDeckRecords(Number(id));
    } catch (error) {
      console.error("Error fetching previous records:", error);
    }

    let recordsAchievements: UnlockedAchievement[] = [];

    try {
      let recordsResponse;

      if (gameMode === "speedrun") {
        recordsResponse = await updateDeckRecords(Number(id), {
          gameMode: "speedrun",
          speedRunTime: elapsedTime,
          timePenalty: timePenalty,
          sessionBestStreak: bestStreakRef.current,
        });
      } else if (gameMode === "streak") {
        recordsResponse = await updateDeckRecords(Number(id), {
          gameMode: "streak",
          streak: bestStreakRef.current,
          sessionBestStreak: bestStreakRef.current,
        });
      } else if (gameMode === "timeattack") {
        recordsResponse = await updateDeckRecords(Number(id), {
          gameMode: "timeattack",
          avgTimePerCard: avgTimePerCard,
          totalCards: currentCards.length,
          sessionBestStreak: bestStreakRef.current,
        });
      } else if (gameMode === "perfect") {
        recordsResponse = await updateDeckRecords(Number(id), {
          gameMode: "perfect",
          isPerfect: isPerfectRun,
          sessionBestStreak: bestStreakRef.current,
        });
      } else {
        recordsResponse = await updateDeckRecords(Number(id), {
          gameMode: "classic",
          sessionBestStreak: bestStreakRef.current,
        });
      }

      if (recordsResponse?.unlockedAchievements) {
        recordsAchievements = recordsResponse.unlockedAchievements;
      }
    } catch (error) {
      console.error("Error updating deck records:", error);
    }

    queryClient.invalidateQueries({ queryKey: ["deck", id] });
    queryClient.invalidateQueries({ queryKey: ["deckRecords", id] });

    const allAchievements = [...pendingAchievements, ...recordsAchievements];
    const uniqueAchievements = allAchievements.filter(
      (achievement, index, self) =>
        index === self.findIndex((a) => a.id === achievement.id),
    );

    if (uniqueAchievements.length > 0) {
      showAchievementToast(uniqueAchievements.length);
    }

    const navigationParams = {
      id: id as string,
      sessionCorrect: sessionCorrectRef.current.toString(),
      sessionIncorrect: sessionIncorrectRef.current.toString(),
      sessionBestStreak: bestStreakRef.current.toString(),
      gameMode: gameMode as string,
      finalTime: finalTime.toString(),
      timePenalty: timePenalty.toString(),
      livesLeft: finalLives.toString(),
      isPerfect: isPerfectRun.toString(),
      avgTimePerCard: avgTimePerCard.toString(),
      previousBestSpeedRun:
        previousRecords?.bestSpeedRunTime?.toString() || "null",
      previousBestStreak: previousRecords?.bestStreak?.toString() || "null",
      previousBestAvgTime:
        previousRecords?.bestAvgTimePerCard?.toString() || "null",
      previousPerfectRuns:
        previousRecords?.perfectRunsCompleted?.toString() || "null",
    };

    navigateToComplete(navigationParams);
  }, [
    gameMode,
    id,
    livesRef,
    isPerfectRun,
    elapsedTime,
    timePenalty,
    bestStreakRef,
    sessionCorrectRef,
    sessionIncorrectRef,
    stopTimer,
    stopCardTimer,
    getTotalTime,
    getTotalTimeUsed,
    queryClient,
    pendingAchievements,
    navigateToComplete,
    showAchievementToast,
  ]);

  const goToNextCard = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= cardsRef.current.length) {
        finishSession();
        return prev;
      }
      return nextIndex;
    });

    setIsFlipped(false);
  }, [finishSession]);

  const handleIncorrect = useCallback(async () => {
    const currentCard = cardsRef.current[currentIndex];
    if (!currentCard) return;

    try {
      await answerMutation.mutateAsync({
        cardId: currentCard.id,
        success: false,
      });
      recordIncorrect();

      if (gameMode === "speedrun") {
        addPenalty(5);
      }

      if (gameMode === "streak") {
        const newLives = loseLife();
        if (newLives <= 0) {
          finishSession();
          return;
        }
      }

      if (gameMode === "perfect") {
        failPerfectRun();
        finishSession();
        return;
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    goToNextCard();
  }, [
    currentIndex,
    answerMutation,
    recordIncorrect,
    goToNextCard,
    gameMode,
    addPenalty,
    loseLife,
    failPerfectRun,
    finishSession,
  ]);

  useEffect(() => {
    handleIncorrectRef.current = handleIncorrect;
  }, [handleIncorrect]);

  const handleCorrect = useCallback(async () => {
    const currentCard = cardsRef.current[currentIndex];
    if (!currentCard) return;

    try {
      await answerMutation.mutateAsync({
        cardId: currentCard.id,
        success: true,
      });
      recordCorrect();
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    goToNextCard();
  }, [currentIndex, answerMutation, recordCorrect, goToNextCard]);

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  if (isLoading) {
    return <LoadingScreen loading />;
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return <LoadingScreen loading />;
  }

  const currentCard = cards[currentIndex];
  const cardProgress = Array.isArray(currentCard.progress)
    ? currentCard.progress.find((p) => p.userId === user?.id)
    : currentCard.progress;
  const cardStatus = cardProgress?.status || "bronze";

  const frontText =
    isReverse === "true" ? currentCard.translation : currentCard.word;
  const backText =
    isReverse === "true" ? currentCard.word : currentCard.translation;
  const frontLabel =
    isReverse === "true"
      ? t("trainSession.card.labels.translation")
      : t("trainSession.card.labels.word");
  const backLabel =
    isReverse === "true"
      ? t("trainSession.card.labels.word")
      : t("trainSession.card.labels.translation");

  return (
    <View className="flex-1 bg-background">
      <Scanlines />
      <SessionHeader
        deckName={deck?.name || ""}
        isReverse={isReverse === "true"}
        onClose={() => router.back()}
      />

      <SessionProgress
        currentIndex={currentIndex}
        totalCards={cards.length}
        gameMode={gameMode as GameMode}
        elapsedTime={elapsedTime}
        timePenalty={timePenalty}
        lives={lives}
        cardTimeLeft={cardTimeLeft}
      />

      <View className="flex-1 justify-center items-center px-6 pb-8">
        <FlashCard
          key={`${currentCard.id}-${currentIndex}`}
          cardKey={`${currentCard.id}-${currentIndex}`}
          status={cardStatus}
          isFlipped={isFlipped}
          frontText={frontText}
          frontLabel={frontLabel}
          backText={backText}
          backLabel={backLabel}
          onFlip={flipCard}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </View>
    </View>
  );
}
