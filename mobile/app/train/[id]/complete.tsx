import { useEffect, useState, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decks.api";
import { getDeckRecords } from "@/services/deck_records.api";
import { useAuth } from "@/services/auth_context";
import { useTranslation } from "react-i18next";
import useModeStats from "@/hooks/useModeStats";
import CompleteHeader from "@/app/components/train/complete/CompleteHeader";
import ModeStatsCard from "@/app/components/train/complete/ModeStatsCard";
import PerformanceCard from "@/app/components/train/complete/PerformanceCard";
import StatsGrid from "@/app/components/train/complete/StatsGrid";
import AlmostThereSection from "@/app/components/train/complete/AlmostThereSection";
import CompleteActions from "@/app/components/train/complete/CompleteActions";

// Couleurs des modes
const MODE_COLORS: Record<string, string> = {
  classic: "#5b8af5",
  speedrun: "#e8453c",
  streak: "#06b6d4",
  timeattack: "#a855f7",
  perfect: "#f5c542",
};

export default function TrainingCompleteScreen() {
  const {
    id,
    sessionCorrect,
    sessionIncorrect,
    sessionBestStreak,
    gameMode,
    finalTime,
    timePenalty,
    livesLeft,
    isPerfect,
    previousBestSpeedRun,
    previousBestStreak,
    previousBestAvgTime,
    previousPerfectRuns,
    avgTimePerCard,
  } = useLocalSearchParams();

  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: deck } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(Number(id)),
    refetchOnMount: "always",
    staleTime: 0,
  });

  const {
    data: deckRecords,
    isLoading: isLoadingRecords,
    isError,
    error,
  } = useQuery({
    queryKey: ["deckRecords", id, user?.id],
    queryFn: () => getDeckRecords(Number(id)),
    enabled: !!user && !!id,
    refetchOnMount: "always",
    staleTime: 0,
    retry: false,
  });

  const isRealError =
    isError &&
    !(
      (error as any)?.message?.includes("404") ||
      (error as any)?.message?.includes("No records found")
    );

  const totalCorrect = Number(sessionCorrect) || 0;
  const totalIncorrect = Number(sessionIncorrect) || 0;
  const bestStreak = Number(sessionBestStreak) || 0;
  const currentGameMode = (gameMode as string) || "classic";
  const speedRunTime = Number(finalTime) || 0;
  const speedRunPenalty = Number(timePenalty) || 0;
  const currentLives = Number(livesLeft) || 0;
  const wasPerfect = isPerfect === "true";
  const totalCards = deck?.cards.length || 0;
  const sessionAvgTime = Number(avgTimePerCard) || 0;

  const prevSpeedRun =
    previousBestSpeedRun === "null" || !previousBestSpeedRun
      ? null
      : Number(previousBestSpeedRun);

  const prevStreak =
    previousBestStreak === "null" || !previousBestStreak
      ? null
      : Number(previousBestStreak);

  const prevAvgTime =
    previousBestAvgTime === "null" || !previousBestAvgTime
      ? null
      : Number(previousBestAvgTime);

  const prevPerfect =
    previousPerfectRuns === "null" || !previousPerfectRuns
      ? null
      : Number(previousPerfectRuns);

  const successRate = useMemo(() => {
    if (totalCorrect + totalIncorrect === 0) return 0;
    return Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100);
  }, [totalCorrect, totalIncorrect]);

  const modeStats = useModeStats({
    gameMode: currentGameMode,
    deckRecords,
    sessionCorrect: totalCorrect,
    sessionIncorrect: totalIncorrect,
    bestStreak,
    speedRunTime,
    speedRunPenalty,
    totalCards,
    currentLives,
    wasPerfect,
    avgTimePerCard: sessionAvgTime,
    previousBestSpeedRun: prevSpeedRun,
    previousBestStreak: prevStreak,
    previousBestAvgTime: prevAvgTime,
    previousPerfectRuns: prevPerfect,
    isLoadingRecords,
    recordsError: isRealError,
  });

  const almostUpgradeCards = useMemo(() => {
    if (!deck) return [];

    const getNextLevel = (maxStreak: number) => {
      if (maxStreak >= 70)
        return {
          level: "ruby",
          name: "Ruby",
          icon: "diamond",
          color: "#dc2626",
          required: 100,
        };
      if (maxStreak >= 50)
        return {
          level: "platinum",
          name: "Platinum",
          icon: "medal",
          color: "#94a3b8",
          required: 70,
        };
      if (maxStreak >= 30)
        return {
          level: "gold",
          name: "Gold",
          icon: "trophy",
          color: "#f59e0b",
          required: 50,
        };
      if (maxStreak >= 10)
        return {
          level: "silver",
          name: "Silver",
          icon: "ribbon",
          color: "#d1d5db",
          required: 30,
        };
      return {
        level: "bronze",
        name: "Bronze",
        icon: "help-circle",
        color: "#cd7f32",
        required: 10,
      };
    };

    const cardsWithProgress = deck.cards.filter((card) => card.progress) || [];

    const cardsWithUpgradeInfo = cardsWithProgress
      .map((card) => {
        const maxStreak = card.progress?.maxStreak || 0;
        const nextLevel = getNextLevel(maxStreak);

        if (nextLevel.level === "max") return null;

        const remaining = nextLevel.required - maxStreak;
        const percentToNext =
          ((nextLevel.required - remaining) / nextLevel.required) * 100;

        return {
          ...card,
          remaining,
          nextLevel,
          percentToNext,
        };
      })
      .filter((card) => card !== null && card.remaining > 0);

    if (totalCards >= 3) {
      return cardsWithUpgradeInfo
        .sort((a, b) => a.remaining - b.remaining)
        .slice(0, 3);
    }

    return cardsWithUpgradeInfo
      .filter((card) => card.remaining <= 3)
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 3);
  }, [deck, totalCards]);

  const headerConfig = useMemo(() => {
    const modeColor = MODE_COLORS[currentGameMode] || MODE_COLORS.classic;

    if (currentGameMode === "perfect" && wasPerfect) {
      return {
        icon: "diamond",
        color: "#f5c542",
        title: t("trainComplete.headers.perfect"),
      };
    }
    if (modeStats?.isRecord && !isRealError) {
      return {
        icon: "trophy",
        color: "#44d9a0",
        title: t("trainComplete.headers.newRecord"),
      };
    }
    return {
      icon: "checkmark-circle",
      color: modeColor,
      title: t("trainComplete.headers.complete"),
    };
  }, [currentGameMode, wasPerfect, modeStats?.isRecord, isRealError, t]);

  return (
    <View className="flex-1 bg-background">
      <CompleteHeader
        icon={headerConfig.icon}
        color={headerConfig.color}
        title={headerConfig.title}
        deckName={deck?.name}
        isRecord={modeStats?.isRecord && !isRealError}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
      >
        {modeStats && !isRealError && <ModeStatsCard modeStats={modeStats} />}

        {(currentGameMode !== "perfect" || !wasPerfect) && (
          <PerformanceCard successRate={successRate} />
        )}

        <StatsGrid
          correct={totalCorrect}
          incorrect={totalIncorrect}
          totalCards={totalCards}
          bestStreak={bestStreak}
        />

        <AlmostThereSection cards={almostUpgradeCards} />
      </ScrollView>

      <CompleteActions deckId={id} />
    </View>
  );
}
