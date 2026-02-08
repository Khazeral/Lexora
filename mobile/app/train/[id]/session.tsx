import { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, StyleSheet, Animated } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import SwipeableCard from "@/app/components/train/session/SwipeableCard";
import {
  CardFrontContent,
  CardBackContent,
} from "@/app/components/train/session/CardContent";
import useSessionTimer from "@/hooks/useSessionTimer";
import useCardTimer from "@/hooks/useCardTimer";
import useSessionStats from "@/hooks/useSessionStats";
import useGameModeState from "@/hooks/useGameModeState";
import { getSubtextColor, getTextColor } from "@/constants/cardColors";

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
  const [flipAnim, setFlipAnim] = useState(() => new Animated.Value(0));

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

  const handleSwipeLeftRef = useRef<() => void>(() => {});

  const { cardTimeLeft, stopCardTimer, getTotalTimeUsed, resetTotalTime } =
    useCardTimer(gameMode as string, isFlipped, currentIndex, () =>
      handleSwipeLeftRef.current(),
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

    // Combiner tous les achievements
    const allAchievements = [...pendingAchievements, ...recordsAchievements];
    const uniqueAchievements = allAchievements.filter(
      (achievement, index, self) =>
        index === self.findIndex((a) => a.id === achievement.id),
    );

    // Afficher le toast si des achievements ont été débloqués
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
    setFlipAnim(new Animated.Value(0));
  }, [finishSession]);

  const handleSwipeLeft = useCallback(async () => {
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
    handleSwipeLeftRef.current = handleSwipeLeft;
  }, [handleSwipeLeft]);

  const handleSwipeRight = useCallback(async () => {
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
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped((prev) => !prev);
  }, [flipAnim, isFlipped]);

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

  const textColor = getTextColor(cardStatus);
  const subtextColor = getSubtextColor(cardStatus);

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
    <GestureHandlerRootView style={styles.container}>
      <SessionHeader
        deckName={deck.name}
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

      <View style={styles.cardArea}>
        <View style={styles.cardContainer}>
          <SwipeableCard
            key={`${currentCard.id}-${currentIndex}`}
            cardKey={`${currentCard.id}-${currentIndex}`}
            status={cardStatus}
            isFlipped={isFlipped}
            onFlip={flipCard}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            flipAnim={flipAnim}
            frontContent={
              <CardFrontContent
                label={frontLabel}
                text={frontText}
                textColor={textColor}
                subtextColor={subtextColor}
              />
            }
            backContent={<CardBackContent label={backLabel} text={backText} />}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  cardArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
