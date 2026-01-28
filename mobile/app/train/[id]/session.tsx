import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, StyleSheet, Animated } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getDeck } from "@/services/decks.api";
import { answerCard } from "@/services/progress.api";
import { updateDeckRecords } from "@/services/deck_records.api";
import { useAuth } from "@/services/auth_context";
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnim] = useState(() => new Animated.Value(0));

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

  const { lives, isPerfectRun, loseLife, failPerfectRun, resetGameState } =
    useGameModeState(gameMode as string);

  const { data: deck, isLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
  });

  const answerMutation = useMutation({
    mutationFn: ({ cardId, success }: { cardId: number; success: boolean }) =>
      answerCard(user!.id, cardId, success),
  });

  useEffect(() => {
    resetStats();
    resetGameState();
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [id, resetGameState, resetStats]);

  useEffect(() => {
    if (!deck) return;

    const sessionCards =
      isShuffle === "true" ? shuffle(deck.cards) : deck.cards;
    setCards(sessionCards);
    setCurrentIndex(0);
  }, [deck, isShuffle]);

  const finishSession = useCallback(async () => {
    stopTimer();

    const finalTime = gameMode === "speedrun" ? getTotalTime() : 0;

    try {
      if (gameMode === "speedrun") {
        await updateDeckRecords(Number(id), {
          gameMode: "speedrun",
          speedRunTime: elapsedTime,
          timePenalty: timePenalty,
        });
      } else if (gameMode === "streak") {
        await updateDeckRecords(Number(id), {
          gameMode: "streak",
          streak: bestStreakRef.current,
        });
      } else if (gameMode === "timeattack") {
        const avgTime = 10;
        await updateDeckRecords(Number(id), {
          gameMode: "timeattack",
          avgTimePerCard: avgTime,
          totalCards: cards.length,
        });
      } else if (gameMode === "perfect") {
        await updateDeckRecords(Number(id), {
          gameMode: "perfect",
          isPerfect: isPerfectRun,
        });
      } else {
        await updateDeckRecords(Number(id), {
          gameMode: "classic",
        });
      }
    } catch (error) {
      console.error("Error updating deck records:", error);
    }

    queryClient.invalidateQueries({ queryKey: ["deck", id] });
    queryClient.invalidateQueries({ queryKey: ["deckRecords", id] });

    router.replace({
      pathname: "/train/[id]/complete",
      params: {
        id,
        sessionCorrect: sessionCorrectRef.current.toString(),
        sessionIncorrect: sessionIncorrectRef.current.toString(),
        sessionBestStreak: bestStreakRef.current.toString(),
        gameMode: gameMode as string,
        finalTime: finalTime.toString(),
        timePenalty: timePenalty.toString(),
        livesLeft: lives.toString(),
        isPerfect: isPerfectRun.toString(),
      },
    });
  }, [
    stopTimer,
    gameMode,
    getTotalTime,
    queryClient,
    id,
    sessionCorrectRef,
    sessionIncorrectRef,
    bestStreakRef,
    timePenalty,
    lives,
    isPerfectRun,
    elapsedTime,
    cards.length,
  ]);

  const goToNextCard = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= cards.length) {
        finishSession();
        return prev;
      }
      return nextIndex;
    });
    setIsFlipped(false);
  }, [cards, finishSession]);

  const handleSwipeLeft = useCallback(async () => {
    const currentCard = cards[currentIndex];
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
    cards,
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

  const { cardTimeLeft } = useCardTimer(
    gameMode as string,
    isFlipped,
    currentIndex,
    handleSwipeLeft,
  );

  const handleSwipeRight = useCallback(async () => {
    const currentCard = cards[currentIndex];
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
  }, [cards, currentIndex, answerMutation, recordCorrect, goToNextCard]);

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

  if (currentIndex >= cards.length) {
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
